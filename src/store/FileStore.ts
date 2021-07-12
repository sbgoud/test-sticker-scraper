import { makeAutoObservable } from "mobx";

import { DownloadFileParams, File } from "@airgram/core";
import RootStore from "./RootStore";
import { blobToBase64 } from "../utils";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/StoreProvider";
import HandlersBuilder from "../utils/HandlersBuilder";
import { UPDATE } from "@airgram/constants";
import { useLocalObservable } from "mobx-react-lite";

const cache = new Map<number, [Blob, string]>();

interface IFile {
    file?: File;
    blob?: Blob;
    base64?: string;
}

type DownloadParams = Omit<DownloadFileParams, "fileId">;

export default class FileStore implements IFile {
    file?: File = undefined;
    blob?: Blob = undefined;
    base64?: string = undefined;
    params?: DownloadParams = undefined;

    constructor(private rootStore: RootStore, file?: File, params?: DownloadParams) {
        makeAutoObservable(this);
        this.file = file;
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

    setFile(file?: File, params?: DownloadParams) {
        this.file = file;
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
            const [blob, base64] = chachedValue;

            this.blob = blob;
            this.base64 = base64;

            return;
        }

        await this.rootStore.Airgram.api.downloadFile({ fileId, priority: 2, ...this.params });

        const file = await this.rootStore.Airgram.api.readFilePart({ fileId });

        if (file.response._ !== "filePart") {
            return;
        }

        const blob = file.response.data as unknown as Blob;
        const base64 = await blobToBase64(blob);

        cache.set(fileId, [blob, base64]);

        this.blob = blob;
        this.base64 = base64;
    }
}

export function useFileStore(file?: File, params?: DownloadParams): IFile {
    const rootStore = useContext(StoreContext);

    const store = useLocalObservable(() => new FileStore(rootStore));
    const [state, setState] = useState<IFile | undefined>(undefined);

    useEffect(() => {
        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            await store.setFile(file, params);
            const { blob, base64 } = store;
            setState({ file, blob, base64 });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, store]);

    return { file, blob: state?.blob ?? store.blob, base64: state?.base64 ?? store.base64 };
}
