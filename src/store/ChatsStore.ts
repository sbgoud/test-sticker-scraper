import { UPDATE } from "@airgram/constants";
import { Chat as AirgramChat, ChatPosition, Message } from "@airgram/core";

import { makeAutoObservable, observable } from "mobx";
import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

export interface Chat {
    info?: AirgramChat;
    position?: ChatPosition;
    lastMessage?: Message;
}

export default class ChatsStore {
    offsetOrder = "9223372036854775807";
    chats = new Map<number, Chat>();

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, { chats: observable.shallow, handlers: false });
    }

    updateChat(chatId: number, updater: (chat: Chat) => Chat | void) {
        let chat = this.chats.get(chatId);
        if (!chat) {
            chat = {};
        }

        chat = updater(chat!) ?? chat;
        this.chats.set(chatId, chat!);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (ctx, next) => {
            this.updateChat(ctx.update.chat.id, (chat) => {
                chat.info = ctx.update.chat;
            });

            return next();
        })
        .add(UPDATE.updateChatPosition, (ctx, next) => {
            this.updateChat(ctx.update.chatId, (chat) => {
                chat.position = ctx.update.position;
            });

            return next();
        })
        .add(UPDATE.updateChatLastMessage, (ctx, next) => {
            this.updateChat(ctx.update.chatId, (chat) => {
                chat.lastMessage = ctx.update.lastMessage;
            });

            const position = ctx.update.positions.find((x) => x.list._ === "chatListMain");

            if (position) {
                this.updateChat(ctx.update.chatId, (chat) => {
                    chat.position = position;
                });
            }

            return next();
        })
        .build();

    load() {
        if (this.chatsList.length) {
            const order = this.chatsList[this.chatsList.length - 1].position?.order;
            if (order) {
                this.offsetOrder = order;
            }
        }

        this.rootStore.Airgram.api.getChats({
            chatList: { _: "chatListMain" },
            limit: 10,
        });
    }

    get chatsList() {
        return Array.from(this.chats.values())
            .sort((a, b) => (BigInt(a.position?.order ?? 0) < BigInt(b.position?.order ?? 0) ? 0 : -1))
            .sort((a, b) => {
                const x = a.position?.isPinned;
                const y = b.position?.isPinned;
                return x === y ? 0 : x ? -1 : 1;
            });
    }
}
