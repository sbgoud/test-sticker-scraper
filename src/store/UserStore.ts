import { UPDATE } from "@airgram/constants";
import { User } from "@airgram/core";
import { makeAutoObservable, observable } from "mobx";
import { useEffect, useState } from "react";
import { store as rootStore } from "../components";
import { HandlersBuilder } from "../utils";
import RootStore from "./RootStore";

const cache = new Map<number, User>();

export class UserStore {
    isLoading = false;
    setLoading(value: boolean) {
        this.isLoading = value;
    }
    user?: User = undefined;
    setUser(user: User) {
        this.user = user;
    }

    constructor(private rootStore: RootStore, private userId: number) {
        if (cache.has(userId)) {
            const user = cache.get(userId);
            this.user = user;
        }

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
        .add(UPDATE.updateUser, (action, next) => {
            if (action.update.user.id === this.userId) {
                this.user = action.update.user;
            }

            return next();
        })
        .build();

    async load() {
        if (this.user) {
            return this.user;
        }

        const user = await this.rootStore.Airgram.api.getUser({ userId: this.userId });

        if (user.response._ === "error") {
            throw user.response;
        }

        this.setUser(user.response);
        cache.set(this.userId, user.response);

        return this.user;
    }
}

export function useUser(userId: number) {
    const [store] = useState(() => new UserStore(rootStore, userId));

    useEffect(() => {
        store.load();

        return () => {
            store.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return store.user;
}
