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
    messageIds: Set<number>;
    stickerIds: Set<string>;
    chatIds: Set<number>;
}

const cache = new Map<number, IMessagesStore>();

export default class MessagesStore implements IMessagesStore {
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
    messageIds = new Set<number>();
    stickerIds = new Set<string>();
    chatIds = new Set<number>();

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

        rootStore.events.addListener(this.handlers);
    }

    dispose() {
        this.chatStore.dispose();
        this.rootStore.events.removeListener(this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateNewChat, (action, next) => {
            if (action.update.chat.id === this.chatId) {
                this.load();
            }

            return next();
        })
        .add(UPDATE.updateNewMessage, (action, next) => {
            const message = action.update.message;
            if (message.chatId === this.chatId && !this.messageIds.has(message.id)) {
                this.messageIds.add(message.id);

                if (message.content._ === "messageSticker" && !this.stickerIds.has(message.content.sticker.setId)) {
                    this.addMessage(message as unknown as StickerMessage);
                    this.stickerIds.add(message.content.sticker.setId);
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

                let count = 0;
                for (const message of messages.messages ?? []) {
                    if (
                        message.content._ === "messageSticker" &&
                        !this.stickerIds.has(message.content.sticker.setId) &&
                        !this.messageIds.has(message.id)
                    ) {
                        const content = message.content;
                        this.messageIds.add(message.id);
                        this.stickerIds.add(content.sticker.setId);
                        this.insertMessage(message as StickerMessage);
                        count++;
                    }
                    this.chatIds.add(message.chatId);
                }

                this.setLoadingProgress(
                    this.processed + messages.totalCount,
                    this.total + messages.totalCount,
                    this.batch + 1
                );

                this.save();

                if (count) {
                    return count;
                }
            }
        } finally {
            this.save();
            this.setLoading(false);
        }
    }

    save() {
        const { messages, messageIds, stickerIds, chatIds, startMessage, canLoad } = this;
        cache.set(this.chatId, { messages, messageIds, stickerIds, chatIds, startMessage, canLoad });
    }
}
