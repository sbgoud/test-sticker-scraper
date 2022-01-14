import { UPDATE } from "@airgram/constants";
import { StickerSetInfo } from "@airgram/web";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

export class StickersStore {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    isReordering = false;
    setReordering(value: boolean) {
        this.isReordering = value;
    }
    originalPosition?: number;
    newPosition = 0;
    async saveSetsOrder() {
        if (!this.sets) {
            return;
        }

        const stickerSetIds = this.sets.map((set) => set.id);

        try {
            const reorder = await this.rootStore.Airgram.api.reorderInstalledStickerSets({ stickerSetIds });

            if (reorder.response._ === "error") {
                throw reorder.response;
            }
        } catch {
            if (this.originalPosition) {
                this.moveSet(this.newPosition, this.originalPosition);
            }
        } finally {
            this.originalPosition = undefined;
        }
    }
    swapSets(firstSetId: string, secondSetId: string) {
        if (!this.sets?.length) {
            return;
        }

        const originalPosition = this.sets.findIndex((set) => set.id === firstSetId);

        if (this.originalPosition === undefined) {
            this.originalPosition = originalPosition;
        }

        const newPosition = this.sets.findIndex((set) => set.id === secondSetId);

        this.newPosition = newPosition;

        this.moveSet(originalPosition, newPosition);
    }
    moveSet(originalPosition: number, newPosition: number) {
        if (!this.sets?.length) {
            return;
        }

        const set = this.sets[originalPosition];

        this.sets.splice(originalPosition, 1);
        this.sets.splice(newPosition, 0, set);
    }

    sets?: StickerSetInfo[] = undefined;
    setStickers(sets: StickerSetInfo[]) {
        this.sets = sets;
    }
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            sets: observable.shallow,
            originalPosition: false,
            newPosition: false,
        });

        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateInstalledStickerSets, (ctx, next) => {
            this.load(true);

            return next();
        })
        .build();

    async load(force = false) {
        if (!force && this.isLoading) {
            return;
        }

        if (!force && this.sets) {
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
    toggleReordering() {
        this.setReordering(!this.isReordering);
    }
}

export function useStickersStore(): StickersStore {
    const [store] = useState(() => new StickersStore(rootStore));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store;
}
