import { UPDATE } from "@airgram/constants";
import { Chat } from "@airgram/web";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components/StoreProvider";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

const cache = new Map<number, Chat>();

export class ChatStore {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    chat?: Chat = undefined;
    setChat(chat: Chat) {
        this.chat = chat;
    }

    constructor(private rootStore: RootStore, private chatId: number) {
        if (cache.has(chatId)) {
            const chat = cache.get(chatId);
            this.chat = chat;
        }

        makeAutoObservable(this, {
            chat: observable.ref,
            handlers: false,
        });

        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (ctx, next) => {
            if (ctx.update.chat.id === this.chatId) {
                this.chat = ctx.update.chat;
            }

            return next();
        })
        .build();

    async load() {
        if (this.chat) {
            return this.chat;
        }

        this.setLoading(true);

        try {
            const chat = await this.rootStore.Airgram.api.getChat({ chatId: this.chatId });

            if (chat.response._ === "error") {
                throw chat.response;
            }

            this.setChat(chat.response);
            cache.set(this.chatId, chat.response);

            return this.chat;
        } finally {
            this.setLoading(false);
        }
    }
}

export function useChat(chatId: number) {
    const [store] = useState(() => new ChatStore(rootStore, chatId));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store.chat;
}
