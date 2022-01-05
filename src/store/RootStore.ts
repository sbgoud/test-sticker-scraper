import { Airgram, Composer, MiddlewareFn } from "@airgram/web";
import { EventEmitter } from "events";
import { makeAutoObservable } from "mobx";

import { AirgramFactory } from "./Airgram";

import AuthorizationStore from "./AuthorizationStore";
import ChatsStore from "./ChatsStore";
import ConnectionStore from "./ConnectionStore";
import ThemeStore from "./ThemeStore";

export type EventPayload = Parameters<MiddlewareFn>;

const airgramFactory = new AirgramFactory();

export default class RootStore {
    static eventName = "action";
    events = new EventEmitter();
    private emit: MiddlewareFn = (ctx, next) => {
        console.log(ctx);
        const listeners = (this.events.listeners(RootStore.eventName) ?? []) as MiddlewareFn[];
        return Composer.compose(listeners)(ctx, next);
    };

    Theme = new ThemeStore();
    Airgram: Airgram = undefined as any;
    Authorization = new AuthorizationStore(this);
    Connection = new ConnectionStore(this);
    Chats = new ChatsStore(this);
    constructor() {
        this.resetAirgram();
        makeAutoObservable(this, { events: false, Airgram: false });
    }

    async resetAirgram() {
        this.Airgram = await airgramFactory.makeAsync();
        this.Airgram.use(this.Authorization.handlers, this.Connection, this.Chats.handlers, this.emit);
    }
}
