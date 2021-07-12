import { UPDATE } from "@airgram/constants";
import { Chat, Message, Messages } from "@airgram/core";
import { makeAutoObservable, runInAction } from "mobx";

import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

const limit = 100;

export default class StickerMessagesStore {
    offset = 0;
    canLoad = true;
    chat?: Chat = undefined;
    messages?: Message[] = undefined;
    messageIds = new Map<number, boolean>();

    constructor(private rootStore: RootStore, private chatId: number) {
        makeAutoObservable(this, { dispose: false, handlers: false });
        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewMessage, (ctx, next) => {
            const message = ctx.update.message;
            if (message.chatId === this.chatId && !this.messageIds.has(message.id)) {
                runInAction(() => {
                    this.offset++;

                    if (message.content._ === "messageSticker") {
                        this.messages?.push(message);
                        this.messageIds.set(message.id, true);
                    }
                });
            }
            return next();
        })
        .build();

    async load() {
        if (!this.canLoad) {
            return;
        }

        if (!this.chat) {
            const chat = await this.rootStore.Airgram.api.getChat({ chatId: this.chatId });

            if (chat.response._ === "chat") {
                runInAction(() => {
                    this.chat = chat.response as Chat;
                });
            }
        }

        const history = await this.rootStore.Airgram.api.getChatHistory({
            chatId: this.chatId,
            limit,
            offset: this.offset,
        });

        if (history.response._ === "messages") {
            const messages = history.response as Messages;
            runInAction(() => {
                this.offset += messages.totalCount;
            });

            if (messages.totalCount === 0) {
                runInAction(() => {
                    this.canLoad = false;
                });
                return;
            }

            if (this.messages === undefined) {
                runInAction(() => {
                    this.messages = [];
                });
            }

            const stickerMessages = messages
                .messages!.filter((x) => x.content._ === "messageSticker")
                .filter((x) => !this.messageIds.has(x.id));

            runInAction(() => {
                for (const message of stickerMessages) {
                    this.messageIds.set(message.id, true);
                }
                this.messages!.unshift(...stickerMessages);
            });
        }
    }
}
