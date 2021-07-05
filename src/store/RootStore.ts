import { Airgram } from "@airgram/web";
import { makeAutoObservable } from "mobx";
import createAirgram from "./Airgram";

import AuthorizationStore from "./AuthorizationStore";
import ChatsStore from "./ChatsStore";
import ConnectionStore from "./ConnectionStore";
import ThemeStore from "./ThemeStore";

export default class RootStore {
    Theme = new ThemeStore();
    Airgram: Airgram = undefined as any;
    Authorization = new AuthorizationStore(this);
    Connection = new ConnectionStore(this);
    Chats = new ChatsStore(this);
    constructor() {
        this.resetAirgram();
        makeAutoObservable(this, { Airgram: false });
    }

    async resetAirgram() {
        this.Airgram = await createAirgram();
        this.Airgram.use(this.Authorization, this.Connection, this.Chats);
    }
}
