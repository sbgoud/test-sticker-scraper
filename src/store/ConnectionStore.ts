import { CONNECTION_STATE, UPDATE } from "@airgram/constants";
import { MiddlewareFn, UpdateConnectionState } from "@airgram/core";
import { makeAutoObservable } from "mobx";
import RootStore from "./RootStore";

export default class ConnectionStore {
    state: CONNECTION_STATE = CONNECTION_STATE.connectionStateWaitingForNetwork;
    setState(state: CONNECTION_STATE) {
        this.state = state;
    }

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            middleware: false,
        });
    }

    middleware = (): MiddlewareFn => async (ctx, next) => {
        if (ctx._ === UPDATE.updateConnectionState && "update" in ctx) {
            const context = ctx.update as unknown as UpdateConnectionState;
            const state = context.state._ as CONNECTION_STATE;

            this.setState(state);
        }

        return next();
    };
}
