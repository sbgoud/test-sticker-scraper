import { makeAutoObservable, runInAction } from "mobx";

import { File } from "@airgram/core";
import RootStore from "./RootStore";
import { blobToBase64 } from "../utils";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../components/StoreProvider";

const cache = new Map<number, [Blob, string]>();

interface IFile {
    file?: File;
    blob?: Blob;
    base64?: string;
}

export default class FileStore implements IFile {
    blob?: Blob = undefined;
    base64?: string = undefined;

    constructor(private rootStore: RootStore, public file?: File) {
        makeAutoObservable(this);

        this.load();
    }

    setFile(file?: File) {
        this.file = file;
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

        await this.rootStore.Airgram.api.downloadFile({ fileId, priority: 2 });

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

export function useFileStore(file?: File) {
    const rootStore = useContext(StoreContext);

    const [store] = useState(() => new FileStore(rootStore));
    const [state, setState] = useState<IFile | undefined>(undefined);

    useEffect(() => {
        (async () => {
            await store.setFile(file);
            setState(store);
        })();
    }, [file, store]);

    return state;
}
