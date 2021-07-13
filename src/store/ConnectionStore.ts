import { MiddlewareFn, UpdateConnectionState } from "@airgram/core";
import { UPDATE, CONNECTION_STATE } from "@airgram/constants";

import RootStore from "./RootStore";
import { makeAutoObservable } from "mobx";

export default class ConnectionStore {
    state: CONNECTION_STATE = CONNECTION_STATE.connectionStateWaitingForNetwork;

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            middleware: false,
        });
    }

    middleware = (): MiddlewareFn => async (ctx, next) => {
        if (ctx._ === UPDATE.updateConnectionState && "update" in ctx) {
            const context = ctx.update as unknown as UpdateConnectionState;
            const state = context.state._ as CONNECTION_STATE;

            this.state = state;
        }

        return next();
    };
}
