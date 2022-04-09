import { UPDATE } from "@airgram/constants";
import { DownloadFileParams, File } from "@airgram/core";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { blobToBase64, blobToJson, blobToLotty, blobToText, blobToUrl } from "../utils";
import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

type FileFormats = "blob" | "base64" | "text" | "json" | "lotty" | "url";

type FileFormat<TFormat extends FileFormats> = TFormat extends "blob"
    ? Blob
    : TFormat extends "base64" | "text"
    ? string
    : TFormat extends "json" | "lotty"
    ? object
    : never;

type DownloadParams = Omit<DownloadFileParams, "fileId">;

interface FileContent<TFormat extends FileFormats> {
    blob?: Blob;
    content?: FileFormat<TFormat>;
}

const cache = new Map<number, FileContent<any>>();

export default class FileStore<TFormat extends FileFormats> implements FileContent<TFormat> {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    private format?: FileFormats = undefined;
    private file?: File = undefined;
    content?: FileFormat<TFormat> = undefined;
    blob?: Blob = undefined;
    setContent({ blob, content }: FileContent<TFormat>) {
        this.blob = blob;
        this.content = content;
    }
    private params?: DownloadParams = undefined;
    constructor(private rootStore: RootStore, file?: File, format?: FileFormats, params?: DownloadParams) {
        makeAutoObservable(this, { content: observable.ref, handlers: false });
        this.file = file;
        this.format = format;
        this.params = params;
        this.load();

        rootStore.events.addListener(this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(this.handlers);
    }

    handlers = new HandlersBuilder()
        //.add(UPDATE.error)
        .add(UPDATE.updateFile, (action, next) => {
            if (action.update.file.id === this.file?.id) {
                this.load();
            }

            return next();
        })
        .build();

    setFile(file?: File, format?: FileFormats, params?: DownloadParams) {
        this.file = file;

        if (this.format !== format) {
            this.content = undefined;
            this.format = format;
        }

        this.params = params;
        return this.load();
    }

    async load() {
        if (!this.file || this.isLoading) {
            return;
        }

        if (this.content) {
            return this.content;
        }

        try {
            this.setLoading(true);

            const fileId = this.file.id;

            const cachedValue = cache.get(fileId);
            if (cachedValue?.blob?.size === this.file.size) {
                this.setContent(cachedValue);
                return cachedValue;
            }

            let blob = this.blob ?? new Blob();

            if (!this.blob) {
                const download = await this.rootStore.Airgram.api.downloadFile({
                    fileId,
                    priority: 1,
                    ...this.params,
                });

                this.setContent({ blob });

                if (download.response._ === "error") {
                    return;
                }
            }

            while (blob.size < this.file.size) {
                const file = await this.rootStore.Airgram.api.readFilePart({
                    fileId,
                    offset: blob.size,
                });

                if (file.response._ === "error") {
                    this.setContent({ blob });
                    console.log("ERROR", file.response, file);
                    if (file.response.message === "Error: FS error") {
                        continue;
                    }
                    return;
                }

                blob = new Blob([blob, file.response.data]);
            }

            let content: any = null;
            if (this.format === "blob") {
                content = blob;
            }

            if (this.format === "base64") {
                content = await blobToBase64(blob);
            }

            if (this.format === "url") {
                content = await blobToUrl(blob);
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

            cache.set(fileId, { blob, content });
            this.setContent({ blob, content });

            return content;
        } catch (error) {
            console.error(error);
        } finally {
            this.setLoading(false);
        }
    }
}

export function useFileStore<TResult extends FileFormats>(
    file?: File,
    format?: TResult,
    params?: DownloadParams
): FileFormat<TResult> | undefined {
    const [store] = useState(() => new FileStore<TResult>(rootStore, file, format, params));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        store.setFile(file, format, params);
    }, [file, format, params, store]);

    return store.content;
}
