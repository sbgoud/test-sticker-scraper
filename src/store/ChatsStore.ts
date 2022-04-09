import { UPDATE } from "@airgram/constants";
import { Chat as AirgramChat, ChatPosition, Message } from "@airgram/core";
import { makeAutoObservable, observable } from "mobx";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

export interface ChatRecord {
    info?: AirgramChat;
    position?: ChatPosition;
    lastMessage?: Message;
}

export default class ChatsStore {
    chatsStore = new Map<number, ChatRecord>();
    setChat(chatId: number, updater: (chat: ChatRecord) => ChatRecord | void) {
        let chat = this.chatsStore.get(chatId);
        if (!chat) {
            chat = {};
        }

        chat = updater(chat!) ?? chat;
        this.chatsStore.set(chatId, chat!);
    }

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, { chatsStore: observable.shallow, handlers: false });

        rootStore.events.addListener(this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (action, next) => {
            this.setChat(action.update.chat.id, (chat) => {
                chat.info = action.update.chat;
            });

            return next();
        })
        .add(UPDATE.updateChatPosition, (action, next) => {
            if (action.update.position.list._ === "chatListMain") {
                this.setChat(action.update.chatId, (chat) => {
                    chat.position = action.update.position;
                });
            }

            return next();
        })
        .add(UPDATE.updateChatLastMessage, (action, next) => {
            this.setChat(action.update.chatId, (chat) => {
                chat.lastMessage = action.update.lastMessage;
            });

            const position = action.update.positions.find((x) => x.list._ === "chatListMain");

            if (position) {
                this.setChat(action.update.chatId, (chat) => {
                    chat.position = position;
                });
            }

            return next();
        })
        .build();

    async load() {
        const chats = await this.rootStore.Airgram.api.loadChats({
            chatList: { _: "chatListMain" },
            limit: 10,
        });
        console.log("Chats", chats);
    }

    get chats() {
        return Array.from(this.chatsStore.values());
    }

    get discover() {
        return this.chats.filter((x) => x.position === undefined);
    }

    get chatListMain() {
        return this.chats
            .filter((x) => x.position?.list._ === "chatListMain")
            .sort((a, b) => (BigInt(a.position?.order ?? 0) < BigInt(b.position?.order ?? 0) ? 0 : -1))
            .sort((a, b) => {
                const x = a.position?.isPinned;
                const y = b.position?.isPinned;
                return x === y ? 0 : x ? -1 : 1;
            });
    }
}
