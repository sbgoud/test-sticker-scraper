import { makeAutoObservable } from "mobx";
import Airgram from "./Airgram";

import AuthorizationStore from "./AuthorizationStore";
import ConnectionStore from "./ConnectionStore";

export default class RootStore {
    Airgram = Airgram;
    Authorization = new AuthorizationStore(this);
    Connection = new ConnectionStore(this);
    constructor() {
        Airgram.use(this.Authorization, this.Connection);

        makeAutoObservable(this, { Airgram: false });
    }
}
