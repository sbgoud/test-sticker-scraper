import { UPDATE } from "@airgram/constants";
import { Chat, Message, Messages, MessageSticker } from "@airgram/core";
import { makeAutoObservable, runInAction } from "mobx";

import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

const limit = 100;

export interface StickerMessage extends Message {
    content: MessageSticker;
}

interface IMessagesStore {
    offset: number;
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
    offset = 0;
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
                runInAction(() => {
                    this.offset++;

                    if (message.content._ === "messageSticker" && !this.stickerIds.has(message.content.sticker.setId)) {
                        this.messages?.push(message as any);
                        this.messageIds.set(message.id, true);
                        this.stickerIds.set(message.content.sticker.setId, true);
                    }
                });
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
        if (!this.canLoad) {
            return;
        }

        runInAction(() => {
            this.isLoading = true;
        });

        try {
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

                runInAction(() => {
                    for (const message of stickerMessages) {
                        const content = message.content as MessageSticker;
                        this.messageIds.set(message.id, true);
                        this.stickerIds.set(content.sticker.setId, true);
                    }
                    this.messages!.unshift(...stickerMessages);
                });

                this.save();
            }
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    save() {
        const { chat, messages, messageIds, stickerIds, offset, canLoad } = this;
        cache.set(this.chatId, { chat, messages, messageIds, stickerIds, offset, canLoad });
    }
}
