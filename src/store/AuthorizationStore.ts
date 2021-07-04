import { MiddlewareFn, UpdateAuthorizationState } from "@airgram/core";
import { UPDATE, AUTHORIZATION_STATE } from "@airgram/constants";

import RootStore from "./RootStore";
import { makeAutoObservable, runInAction } from "mobx";

export default class AuthorizationStore {
    state: AUTHORIZATION_STATE = AUTHORIZATION_STATE.authorizationStateClosed;

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            middleware: false,
        });
    }

    middleware = (): MiddlewareFn => async (ctx, next) => {
        if (ctx._ === UPDATE.updateAuthorizationState && "update" in ctx) {
            const context = ctx.update as unknown as UpdateAuthorizationState;
            const state = context.authorizationState._ as AUTHORIZATION_STATE;
            runInAction(() => {
                this.state = state;
            });
        }

        return next();
    };
}
