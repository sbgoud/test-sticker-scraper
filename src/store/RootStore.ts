import { Airgram } from "@airgram/web";
import { makeAutoObservable } from "mobx";
import createAirgram from "./Airgram";

import AuthorizationStore from "./AuthorizationStore";
import ConnectionStore from "./ConnectionStore";

export default class RootStore {
    Airgram: Airgram = undefined as any;
    Authorization = new AuthorizationStore(this);
    Connection = new ConnectionStore(this);
    constructor() {
        this.resetAirgram();
        makeAutoObservable(this, { Airgram: false });
    }

    async resetAirgram() {
        this.Airgram = await createAirgram();
        this.Airgram.use(this.Authorization, this.Connection);
    }
}
