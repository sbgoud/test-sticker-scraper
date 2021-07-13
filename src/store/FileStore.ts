import { makeAutoObservable } from "mobx";

import { DownloadFileParams, File } from "@airgram/core";
import RootStore from "./RootStore";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/StoreProvider";
import HandlersBuilder from "../utils/HandlersBuilder";
import { UPDATE } from "@airgram/constants";
import { useLocalObservable } from "mobx-react-lite";
import { blobToBase64, blobToJson, blobToLotty, blobToText } from "../utils";

const cache = new Map<number, any>();

type FileFormats = "blob" | "base64" | "text" | "json" | "lotty";

type FileFormat<TFormat extends FileFormats> = TFormat extends "blob"
    ? Blob
    : TFormat extends "base64" | "text"
    ? string
    : TFormat extends "json" | "lotty"
    ? object
    : never;

interface IFile<TFormat extends FileFormats> {
    file?: File;
    content?: FileFormat<TFormat>;
}

type DownloadParams = Omit<DownloadFileParams, "fileId">;

export default class FileStore<TFormat extends FileFormats> implements IFile<TFormat> {
    format?: FileFormats = undefined;
    file?: File = undefined;
    content?: FileFormat<TFormat> = undefined;
    params?: DownloadParams = undefined;

    constructor(private rootStore: RootStore, file?: File, format?: FileFormats, params?: DownloadParams) {
        makeAutoObservable(this);
        this.file = file;
        this.format = format;
        this.params = params;
        this.load();

        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateFile, (ctx, next) => {
            if (ctx.update.file.id === this.file?.id) {
                this.load();
            }

            return next();
        })
        .build();

    setFile(file?: File, format?: FileFormats, params?: DownloadParams) {
        this.file = file;
        this.format = format;
        this.params = params;
        return this.load();
    }

    async load() {
        if (!this.file) {
            return;
        }

        const fileId = this.file.id;

        const chachedValue = cache.get(fileId);
        if (chachedValue) {
            this.content = chachedValue;

            return;
        }

        await this.rootStore.Airgram.api.downloadFile({ fileId, priority: 2, ...this.params });

        const file = await this.rootStore.Airgram.api.readFilePart({ fileId });

        if (file.response._ !== "filePart") {
            return;
        }

        const blob = file.response.data as unknown as Blob;

        let content: any = null;
        if (this.format === "blob") {
            content = blob;
        }

        if (this.format === "base64") {
            content = await blobToBase64(blob);
        }

        if (this.format === "text") {
            content = await blobToText(blob);
        }

        if (this.format === "json") {
            content = await blobToJson(blob);
        }

        if (this.format === "lotty") {
            content = await blobToLotty(blob);
        }

        cache.set(fileId, content);

        this.content = content;
    }
}

export function useFileStore<TResult extends FileFormats>(
    file?: File,
    format?: TResult,
    params?: DownloadParams
): IFile<TResult> {
    const rootStore = useContext(StoreContext);

    const store = useLocalObservable(() => new FileStore<TResult>(rootStore));
    const [state, setState] = useState<IFile<TResult> | undefined>(undefined);

    useEffect(() => {
        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            await store.setFile(file, format, params);
            const { content } = store;
            setState({ file, content });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, store]);

    return {
        file,
        content: state?.content ?? store.content,
    };
}
