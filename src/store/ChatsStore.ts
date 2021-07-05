import { UPDATE } from "@airgram/constants";
import { MiddlewareFn, UpdateAuthorizationState } from "@airgram/web";
import { makeAutoObservable } from "mobx";
import RootStore from "./RootStore";

export default class ChatsStore {
    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, { middleware: false });
    }

    middleware = (): MiddlewareFn => async (ctx, next) => {
        console.log(ctx);

        if (ctx._ === UPDATE.updateChatChatList && "update" in ctx) {
            const context = ctx.update as unknown as UpdateAuthorizationState;
        }

        return next();
    };

    async init() {
        await this.rootStore.Airgram.api.getChats({ chatList: { _: "chatListMain" }, limit: 10 });
    }
}
