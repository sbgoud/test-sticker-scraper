import { UPDATE } from "@airgram/constants";
import { ApiMethods, Composer, MiddlewareFn, UpdateContext, UpdateUnion } from "@airgram/core";

type UpdateName = `${UPDATE}`;

type UpdateLookup = {
    [P in UpdateName]: Extract<UpdateUnion, { _: P }>;
};

type MethodName = {
    [K in keyof ApiMethods]: K;
}[keyof ApiMethods];

type MethodsLookup = {
    [P in MethodName]: ReturnType<ApiMethods[P]> extends Promise<infer PT> ? PT : never;
};

type ActionName = UpdateName | MethodName;

type PickContext<TAction extends string> = TAction extends UPDATE
    ? UpdateContext<UpdateLookup[TAction]>
    : TAction extends MethodName
    ? MethodsLookup[TAction]
    : never;

type Handler<TAction extends ActionName> = MiddlewareFn<PickContext<TAction>>;

type HandlerRecord<TAction extends ActionName> = [action: TAction, handler: Handler<TAction>];

export class HandlersBuilder {
    private handlers: Array<HandlerRecord<any>> = [];
    add<TAction extends ActionName>(...args: HandlerRecord<TAction>) {
        this.handlers.push(args);
        return this;
    }

    build(): MiddlewareFn {
        return (action, next) => {
            const handlers = this.handlers.filter(([update]) => update === action._) ?? [];

            if (handlers.length) {
                return Composer.compose(handlers.map(([, handler]) => handler))(action, next);
            }

            return next();
        };
    }
}
