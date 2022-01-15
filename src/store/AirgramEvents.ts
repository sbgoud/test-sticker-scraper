import { Composer, MiddlewareFn } from "@airgram/web";
import { EventEmitter } from "events";

export class AirgramEvents {
    event: EventEmitter;
    static eventName = "action";
    constructor() {
        this.event = new EventEmitter();
        this.event.setMaxListeners(99);
    }
    emit: MiddlewareFn = (action, next) => {
        //console.log(action);
        const listeners = (this.event.listeners(AirgramEvents.eventName) ?? []) as MiddlewareFn[];
        return Composer.compose(listeners)(action, next);
    };
    addListener(listener: MiddlewareFn) {
        this.event.addListener(AirgramEvents.eventName, listener);
        return this;
    }
    removeListener(listener: MiddlewareFn) {
        this.event.removeListener(AirgramEvents.eventName, listener);
        return this;
    }
}
