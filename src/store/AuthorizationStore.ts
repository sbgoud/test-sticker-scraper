import { AUTHORIZATION_STATE, UPDATE } from "@airgram/constants";
import { AuthorizationStateUnion, User } from "@airgram/core";
import { makeAutoObservable, observable } from "mobx";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

export default class AuthorizationStore {
    state?: AuthorizationStateUnion = undefined;
    setState(state: AuthorizationStateUnion) {
        this.state = state;
    }
    firstLaunch = true;
    user?: User;
    setUser(user: User) {
        this.user = user;
    }

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            user: observable.ref,
            handlers: false,
        });

        rootStore.events.addListener(this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateAuthorizationState, (action, next) => {
            const state = action.update.authorizationState;

            if (
                this.firstLaunch &&
                state._ === AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber &&
                this.state?._ === AUTHORIZATION_STATE.authorizationStateWaitEncryptionKey
            ) {
                this.firstLaunch = false;
                this.switchToQr();
                return;
            }

            this.setState(state);

            return next();
        })
        .build();

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

    async logOut() {
        await this.rootStore.Airgram.api.logOut();
        this.firstLaunch = true;
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

    async getMe() {
        if (this.user) {
            return;
        }

        const user = await this.rootStore.Airgram.api.getMe();

        if (user.response._ === "error") {
            throw user.response;
        }

        this.setUser(user.response);
    }
}
