import { CONNECTION_STATE, UPDATE } from "@airgram/constants";
import { makeAutoObservable } from "mobx";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

export default class ConnectionStore {
    state: CONNECTION_STATE = CONNECTION_STATE.connectionStateWaitingForNetwork;
    setState(state: CONNECTION_STATE) {
        this.state = state;
    }

    constructor(private rootStore: RootStore) {
        makeAutoObservable(this, {
            handlers: false,
        });

        rootStore.events.addListener(this.handlers);
    }

    dispose() {
        this.rootStore.events.removeListener(this.handlers);
    }

    handlers = new HandlersBuilder()
        .add(UPDATE.updateConnectionState, (action, next) => {
            const state = action.update.state._ as CONNECTION_STATE;
            this.setState(state);

            return next();
        })
        .build();
}
