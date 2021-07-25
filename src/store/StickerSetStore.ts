import { StickerSet } from "@airgram/core";
import { makeAutoObservable, observable, runInAction } from "mobx";
import RootStore from "./RootStore";

const cache = new Map<string, StickerSet>();

export default class StickerSetStore {
    set?: StickerSet = undefined;

    constructor(private rootStore: RootStore, private setId: string) {
        makeAutoObservable(this, { set: observable.ref });
    }

    async load() {
        if (this.set) {
            return;
        }

        if (cache.has(this.setId)) {
            const set = cache.get(this.setId);
            runInAction(() => {
                this.set = set;
            });
            return;
        }

        const set = await this.rootStore.Airgram.api.getStickerSet({ setId: this.setId });

        if (set.response._ === "stickerSet") {
            runInAction(() => {
                this.set = set.response as StickerSet;
            });
            cache.set(this.setId, this.set!);
        }
    }
}
