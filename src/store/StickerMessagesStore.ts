import { makeAutoObservable } from "mobx";
import HandlersBuilder from "../utils/HandlersBuilder";
import RootStore from "./RootStore";

const limit = 100;

export default class StickerMessagesStore {
    offset = 0;

    constructor(private rootStore: RootStore, private chatId: number) {
        makeAutoObservable(this, { dispose: false, handlers: false });
        rootStore.events.addListener(RootStore.eventName, this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(RootStore.eventName, this.handlers);
    }

    handlers = new HandlersBuilder().build();

    async load() {
        const chat = await this.rootStore.Airgram.api.getChat({ chatId: this.chatId });

        const history = await this.rootStore.Airgram.api.getChatHistory({
            chatId: this.chatId,
            limit,
            offset: this.offset,
            onlyLocal: false,
        });
        const count = await this.rootStore.Airgram.api.getChatMessageCount({
            chatId: this.chatId,
            filter: { _: "searchMessagesSticker" as any },
        });
        debugger;
    }
}
