import { UPDATE } from "@airgram/constants";
import { Chat as AirgramChat, ChatPosition, Message } from "@airgram/core";

import { makeAutoObservable, runInAction } from "mobx";
import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

export interface Chat {
    info?: AirgramChat;
    position?: ChatPosition;
    lastMessage?: Message;
}

export default class ChatsStore {
    chats = new Map<number, Chat>();
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, { handlers: false });
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (ctx, next) => {
            let chat = this.chats.get(ctx.update.chat.id);

            if (!chat) {
                chat = {};
            }

            chat.info = ctx.update.chat;

            runInAction(() => {
                this.chats.set(ctx.update.chat.id, chat!);
            });

            return next();
        })
        .add(UPDATE.updateChatPosition, (ctx, next) => {
            let chat = this.chats.get(ctx.update.chatId);

            if (!chat) {
                chat = {};
            }

            chat.position = ctx.update.position;

            runInAction(() => {
                this.chats.set(ctx.update.chatId, chat!);
            });

            return next();
        })
        .add(UPDATE.updateChatLastMessage, (ctx, next) => {
            let chat = this.chats.get(ctx.update.chatId);

            if (!chat) {
                chat = {};
            }

            chat.lastMessage = ctx.update.lastMessage;

            const position = ctx.update.positions.find((x) => x.list._ === "chatListMain");

            if (position) {
                chat.position = position;
            }

            runInAction(() => {
                this.chats.set(ctx.update.chatId, chat!);
            });

            return next();
        })
        .build();

    async init() {
        await this.rootStore.Airgram.api.getChats({ chatList: { _: "chatListMain" }, limit: 10 });
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
