import {
    ApiResponse,
    AuthorizationStateUnion,
    FilePart,
    MiddlewareFn,
    ReadFilePartParams,
    UpdateAuthorizationState,
    User,
} from "@airgram/core";
import { UPDATE, AUTHORIZATION_STATE } from "@airgram/constants";

import RootStore from "./RootStore";
import { makeAutoObservable, runInAction } from "mobx";
import { blobToBase64 } from "../utils";

export default class AuthorizationStore {
    state?: AuthorizationStateUnion = undefined;
    firstLaunch = true;
    user?: User;
    userPhoto?: string;

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
        const user = await this.rootStore.Airgram.api.getMe();

        if (user.response._ === "error") {
            throw user.response;
        }

        runInAction(() => {
            this.user = user.response as User;
        });

        const photoId = user.response.profilePhoto?.small?.id;

        if (photoId === undefined) {
            return;
        }

        const photo = await this.rootStore.Airgram.api.readFilePart({ fileId: photoId });

        if (photo.response._ === "filePart") {
            this.userPhoto = await blobToBase64((photo.response as FilePart).data as unknown as Blob);
            console.log(this.userPhoto);
        }
    }
}
