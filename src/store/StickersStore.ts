import { UPDATE } from "@airgram/constants";
import { StickerSetInfo } from "@airgram/web";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
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
    async reorderSets(result: DropResult) {
        if (!this.sets) {
            return;
        }
        const { source, destination } = result;
        if (!destination) {
            return;
        }

        const sourceSet = this.sets[source.index];

        if (source.index === destination.index) {
            return;
        }

        this.sets.splice(source.index, 1);
        this.sets.splice(destination.index, 0, sourceSet);

        const stickerSetIds = this.sets.map((set) => set.id);

        try {
            const reorder = await this.rootStore.Airgram.api.reorderInstalledStickerSets({ stickerSetIds });

            if (reorder.response._ === "error") {
                throw reorder.response;
            }
        } catch {
            this.sets.splice(destination.index, 0, sourceSet);
            this.sets.splice(source.index, 1);
        }
    }

    sets?: StickerSetInfo[] = undefined;
    setStickers(sets: StickerSetInfo[]) {
        this.sets = sets;
    }
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            sets: observable.shallow,
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
