import { MessageSenderUnion } from "@airgram/web";
import { makeAutoObservable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { ChatStore } from "./ChatStore";
import RootStore from "./RootStore";
import { UserStore } from "./UserStore";

export class MessageSenderStore {
    userStore?: UserStore;
    chatStore?: ChatStore;

    constructor(private rootStore: RootStore, private senderId: MessageSenderUnion) {
        if (senderId._ === "messageSenderUser") {
            this.userStore = new UserStore(rootStore, senderId.userId);
        }

        if (senderId._ === "messageSenderChat") {
            this.chatStore = new ChatStore(rootStore, senderId.chatId);
        }

        makeAutoObservable(this);
    }

    dispose() {
        this.userStore?.dispose();
        this.chatStore?.dispose();
    }

    get user() {
        return this.userStore?.user;
    }

    get chat() {
        return this.chatStore?.chat;
    }

    async load() {
        if (this.senderId._ === "messageSenderUser") {
            return this.userStore?.load();
        }

        if (this.senderId._ === "messageSenderChat") {
            return this.chatStore?.load();
        }
    }
}

export function useMessageSenderStore(senderId: MessageSenderUnion) {
    const [store] = useState(() => new MessageSenderStore(rootStore, senderId));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store;
}
