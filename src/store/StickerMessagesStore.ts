import { UPDATE } from "@airgram/constants";
import { Chat, Message, Messages, MessageSticker } from "@airgram/core";
import { makeAutoObservable } from "mobx";

import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

const limit = 100;

export interface StickerMessage extends Message {
    content: MessageSticker;
}

interface IMessagesStore {
    startMessage: number;
    canLoad: boolean;
    chat?: Chat;
    messages?: StickerMessage[];
    messageIds: Map<number, boolean>;
    stickerIds: Map<string, boolean>;
}

const cache = new Map<number, IMessagesStore>();

export default class StickerMessagesStore implements IMessagesStore {
    isLoading = false;
    isRestored = false;
    startMessage = 0;
    canLoad = true;
    chat?: Chat = undefined;
    messages: StickerMessage[] = [];
    messageIds = new Map<number, boolean>();
    stickerIds = new Map<string, boolean>();

    constructor(private rootStore: RootStore, private chatId: number) {
        if (cache.has(chatId)) {
            const values = cache.get(chatId);
            Object.assign(this, values);
            this.isRestored = true;
        }

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
                this.messageIds.set(message.id, true);

                if (message.content._ === "messageSticker" && !this.stickerIds.has(message.content.sticker.setId)) {
                    this.messages?.push(message as any);
                    this.stickerIds.set(message.content.sticker.setId, true);
                }

                this.save();
            }
            return next();
        })
        .build();

    init() {
        if (this.isRestored) {
            return;
        }

        return this.load();
    }

    async load() {
        if (!this.canLoad || this.isLoading) {
            return;
        }

        this.isLoading = true;

        try {
            if (!this.chat) {
                const chat = await this.rootStore.Airgram.api.getChat({ chatId: this.chatId });

                if (chat.response._ === "chat") {
                    this.chat = chat.response as Chat;
                }
            }

            while (true) {
                const history = await this.rootStore.Airgram.api.getChatHistory({
                    chatId: this.chatId,
                    limit,
                    fromMessageId: this.startMessage,
                });

                if (history.response._ === "messages") {
                    const messages = history.response as Messages;

                    if (messages.totalCount === 0) {
                        this.canLoad = false;
                        break;
                    }

                    const lastMessage = messages.messages![messages.messages!.length - 1];
                    this.startMessage = lastMessage.id;

                    const stickerMessages = Array.from(
                        messages
                            .messages!.reduce((acc, message) => {
                                if (
                                    message.content._ === "messageSticker" &&
                                    !acc.has(message.content.sticker.setId) &&
                                    !this.stickerIds.has(message.content.sticker.setId)
                                ) {
                                    acc.set(message.content.sticker.setId, message as any);
                                }
                                return acc;
                            }, new Map<string, StickerMessage>())
                            .values()
                    ).filter((x) => !this.messageIds.has(x.id));

                    for (const message of stickerMessages) {
                        const content = message.content as MessageSticker;

                        this.messageIds.set(message.id, true);
                        this.stickerIds.set(content.sticker.setId, true);
                        this.messages!.unshift(message);
                    }

                    if (stickerMessages.length) {
                        return stickerMessages.length;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.save();
            this.isLoading = false;
        }
    }

    save() {
        const { chat, messages, messageIds, stickerIds, startMessage, canLoad } = this;
        cache.set(this.chatId, { chat, messages, messageIds, stickerIds, startMessage, canLoad });
    }
}
