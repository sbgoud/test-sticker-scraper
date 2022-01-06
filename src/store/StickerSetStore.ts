import { UPDATE } from "@airgram/constants";
import { StickerSet } from "@airgram/core";
import { useToasts } from "@geist-ui/react";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

const cache = new Map<string, StickerSet>();

export default class StickerSetStore {
    set?: StickerSet = undefined;
    setSet(value: StickerSet) {
        this.set = value;
        cache.set(this.setId, this.set!);
    }

    constructor(private rootStore: RootStore, private setId: string, private toasts: ReturnType<typeof useToasts>) {
        if (cache.has(this.setId)) {
            const set = cache.get(this.setId);
            this.setSet(set!);
        }
        makeAutoObservable(this, { set: observable.ref });

        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }
    dispose() {
        rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateStickerSet, (ctx, next) => {
            if (ctx.update.stickerSet.id === this.setId) {
                this.setSet(ctx.update.stickerSet);
            }

            return next();
        })
        .build();

    async load() {
        if (this.set) {
            return this.set;
        }

        try {
            const set = await this.rootStore.Airgram.api.getStickerSet({ setId: this.setId });

            if (set.response._ === "error") {
                throw set.response;
            }

            this.setSet(set.response);
        } finally {
        }
    }

    async install() {
        const [, setToast] = this.toasts;

        try {
            const request = await this.rootStore.Airgram.api.changeStickerSet({
                setId: this.setId,
                isInstalled: true,
                isArchived: false,
            });

            if (request.response._ === "error") {
                throw request.response;
            }

            setToast({
                actions: [
                    {
                        name: "Uninstall",
                        handler: (_, cancel) => {
                            cancel();
                            rootStore.Airgram.api.changeStickerSet({
                                setId: this.setId,
                                isArchived: true,
                            });
                        },
                    },
                ],
                text: "Sticker set has been installed",
            });
        } catch {
            setToast({
                type: "error",
                text: "Error installing sticker set",
            });
        }
    }

    async delete() {
        const [, setToast] = this.toasts;

        try {
            const request = await this.rootStore.Airgram.api.changeStickerSet({ setId: this.setId, isArchived: true });

            if (request.response._ === "error") {
                throw request.response;
            }

            setToast({
                actions: [
                    {
                        name: "Restore",
                        handler: (_, cancel) => {
                            cancel();
                            rootStore.Airgram.api.changeStickerSet({
                                setId: this.setId,
                                isInstalled: true,
                                isArchived: false,
                            });
                        },
                    },
                ],
                text: "Sticker set has been deleted",
            });
        } catch {
            setToast({
                type: "error",
                text: "Error deleting sticker set",
            });
        }
    }
}

export function useStickerSetStore(setId: string): StickerSetStore {
    const toasts = useToasts();
    const [store] = useState(() => new StickerSetStore(rootStore, setId, toasts));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store;
}
