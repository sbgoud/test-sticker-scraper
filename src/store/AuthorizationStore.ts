import { AuthorizationStateUnion, MiddlewareFn, UpdateAuthorizationState } from "@airgram/core";
import { UPDATE, AUTHORIZATION_STATE } from "@airgram/constants";

import RootStore from "./RootStore";
import { makeAutoObservable, runInAction } from "mobx";

export default class AuthorizationStore {
    state?: AuthorizationStateUnion = undefined;
    firstLaunch = true;
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            middleware: false,
        });
    }

    middleware = (): MiddlewareFn => async (ctx, next) => {
        if (ctx._ === UPDATE.updateAuthorizationState && "update" in ctx) {
            const context = ctx.update as unknown as UpdateAuthorizationState;

            const state = context.authorizationState;

            if (
                this.firstLaunch &&
                state._ === AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber &&
                this.state?._ === AUTHORIZATION_STATE.authorizationStateWaitEncryptionKey
            ) {
                this.firstLaunch = false;
                this.switchToQr();
                return;
            }

            runInAction(() => {
                this.state = state;
            });
        }

        return next();
    };

    async switchToQr() {
        if (this.state?._ === AUTHORIZATION_STATE.authorizationStateWaitOtherDeviceConfirmation) {
            return;
        }

        const result = await this.rootStore.Airgram.api.requestQrCodeAuthentication();

        if (result.response._ === "error") {
            return result;
        }

        return result;
    }

    async switchToPhoneNumber() {
        if (this.state?._ === AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber) {
            return;
        }

        await this.reset();
    }

    async reset() {
        this.firstLaunch = false;
        await this.rootStore.resetAirgram();
    }

    sendPhoneNumber(phoneNumber: string) {
        return this.rootStore.Airgram.api.setAuthenticationPhoneNumber({ phoneNumber });
    }

    sendCode(code: string) {
        return this.rootStore.Airgram.api.checkAuthenticationCode({ code });
    }

    sendPassword(password: string) {
        return this.rootStore.Airgram.api.checkAuthenticationPassword({ password });
    }
}
