import { AUTHORIZATION_STATE, UPDATE } from "@airgram/constants";
import { MiddlewareFn } from "@airgram/web";
import { makeAutoObservable } from "mobx";
import { Airgram, AirgramFactory } from "../airgram";
import { HandlersBuilder } from "../utils";
import { AirgramEvents } from "./AirgramEvents";
import AuthorizationStore from "./AuthorizationStore";
import ChatsStore from "./ChatsStore";
import ConnectionStore from "./ConnectionStore";
import { StickersStore } from "./StickersStore";
import ThemeStore from "./ThemeStore";

export type EventPayload = Parameters<MiddlewareFn>;

const airgramFactory = new AirgramFactory();

export default class RootStore {
    isInitialized = false;
    setInitialized(value: boolean) {
        this.isInitialized = value;
    }
    events = new AirgramEvents();
    Theme = new ThemeStore();
    Airgram: Airgram = undefined as any;
    Authorization = new AuthorizationStore(this);
    Connection = new ConnectionStore(this);
    Chats = new ChatsStore(this);
    Stickers = new StickersStore(this);

    constructor() {
        this.events.addListener(this.handlers);
        this.resetAirgram();

        makeAutoObservable(this, { events: false, Airgram: false });
    }

    dispose() {
        this.events.removeListener(this.handlers);
        this.Authorization.dispose();
        this.Connection.dispose();
        this.Chats.dispose();
        this.Stickers.dispose();
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateAuthorizationState, (action, next) => {
            console.log(action.update.authorizationState._);
            if (action.update.authorizationState._ === AUTHORIZATION_STATE.authorizationStateReady) {
                const ctx = this;
                (async function () {
                    await ctx.Chats.load();
                    await ctx.Stickers.load();
                    ctx.setInitialized(true);
                })();
            }

            return next();
        })
        .build();

    async resetAirgram() {
        this.Airgram = await airgramFactory.makeAsync();
        this.Airgram.use(this.events.emit);
    }
}
