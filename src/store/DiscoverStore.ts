import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { ChatRecord } from "./ChatsStore";
import MessagesStore from "./MessagesStore";
import RootStore from "./RootStore";
export class DiscoverStore {
    messagesStore?: MessagesStore;

    constructor(private rootStore: RootStore, private chatId?: number) {
        if (chatId !== undefined) {
            this.messagesStore = new MessagesStore(rootStore, chatId);
        }
    }

    dispose() {
        this.messagesStore?.dispose();
    }

    async load() {
        await this.messagesStore?.init();
    }

    get chats() {
        if (this.messagesStore) {
            const result: ChatRecord[] = [];
            const chats = Array.from(this.messagesStore.chatIds.values());
            for (const chatId of chats) {
                if (chatId === this.chatId) {
                    continue;
                }
                const chat = this.rootStore.Chats.chatsStore.get(chatId);
                if (chat) {
                    result.push(chat);
                }
            }
            return result;
        }

        return this.rootStore.Chats.discover;
    }
}

export function useDiscoverStore(chatId?: number) {
    const [store] = useState(() => new DiscoverStore(rootStore, chatId));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store;
}
