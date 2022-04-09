export function promiseWithTimeout<TResult>(promise: Promise<TResult>, timeout: number): Promise<TResult | void> {
    return Promise.race([
        promise,
        new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        }),
    ]);
}
