import { StickerSetInfo } from "@airgram/web";
import { makeAutoObservable, observable } from "mobx";
import RootStore from "./RootStore";

export class StickersStore {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    sets?: StickerSetInfo[] = undefined;
    setStickers(sets: StickerSetInfo[]) {
        this.sets = sets;
    }
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            sets: observable.shallow,
        });
    }

    async load() {
        if (this.isLoading) {
            return;
        }

        if (this.sets) {
            return this.sets;
        }

        this.setLoading(true);

        try {
            const stickers = await this.rootStore.Airgram.api.getInstalledStickerSets();
            if (stickers.response._ === "error") {
                throw stickers.response;
            }

            this.setStickers(stickers.response.sets);
            return stickers.response.sets;
        } finally {
            this.setLoading(false);
        }
    }

    // get sets() {
    //     return groupBy(this.sets ?? [], (sticker) => sticker.setId);
    // }
}
