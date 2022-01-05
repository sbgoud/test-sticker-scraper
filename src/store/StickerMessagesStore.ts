import { UPDATE } from "@airgram/constants";
import { Message, Messages, MessageSticker } from "@airgram/core";
import { makeAutoObservable, observable } from "mobx";
import HandlersBuilder from "../utils/HandlersBuilder";
import { ChatStore } from "./ChatStore";
import RootStore from "./RootStore";

const limit = 100;

export interface StickerMessage extends Message {
    content: MessageSticker;
}

interface IMessagesStore {
    startMessage: number;
    canLoad: boolean;
    messages?: StickerMessage[];
    messageIds: Map<number, boolean>;
    stickerIds: Map<string, boolean>;
}

const cache = new Map<number, IMessagesStore>();

export default class StickerMessagesStore implements IMessagesStore {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    chatStore: ChatStore;
    isRestored = false;
    startMessage = 0;
    canLoad = true;
    messages: StickerMessage[] = [];
    insertMessage(message: StickerMessage) {
        this.messages.unshift(message);
    }
    addMessage(message: StickerMessage) {
        this.messages.push(message);
    }
    messageIds = new Map<number, boolean>();
    stickerIds = new Map<string, boolean>();

    processed: number = 0;
    total: number = 0;
    batch: number = 0;
    setLoadingProgress(processed: number, total: number, batch: number) {
        this.processed = processed;
        this.total = total;
        this.batch = batch;
    }

    constructor(private rootStore: RootStore, private chatId: number) {
        this.chatStore = new ChatStore(rootStore, chatId);

        if (cache.has(chatId)) {
            const values = cache.get(chatId);
            Object.assign(this, values);
            this.isRestored = true;
        }

        makeAutoObservable(this, {
            messages: observable.shallow,
            messageIds: observable.shallow,
            stickerIds: observable.shallow,
            dispose: false,
            handlers: false,
        });

        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.chatStore.dispose();
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (ctx, next) => {
            if (ctx.update.chat.id === this.chatId) {
                this.load();
            }

            return next();
        })
        .add(UPDATE.updateNewMessage, (ctx, next) => {
            const message = ctx.update.message;
            if (message.chatId === this.chatId && !this.messageIds.has(message.id)) {
                this.messageIds.set(message.id, true);

                if (message.content._ === "messageSticker" && !this.stickerIds.has(message.content.sticker.setId)) {
                    this.addMessage(message as unknown as StickerMessage);
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

        this.setLoadingProgress(0, 0, 0);
        this.setLoading(true);

        try {
            await this.chatStore.load();

            while (true) {
                const history = await this.rootStore.Airgram.api.getChatHistory({
                    chatId: this.chatId,
                    limit,
                    fromMessageId: this.startMessage,
                });

                if (history.response._ === "error") {
                    throw history.response;
                }

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
                    this.insertMessage(message);
                }

                this.setLoadingProgress(
                    this.processed + messages.totalCount,
                    this.total + messages.totalCount,
                    this.batch + 1
                );

                this.save();

                if (stickerMessages.length) {
                    return stickerMessages.length;
                }
            }
        } finally {
            this.save();
            this.setLoading(false);
        }
    }

    save() {
        const { messages, messageIds, stickerIds, startMessage, canLoad } = this;
        cache.set(this.chatId, { messages, messageIds, stickerIds, startMessage, canLoad });
    }
}
