import { Airgram, AirgramConfig } from "@airgram/web";

const useTestDc = false;

const options: AirgramConfig = {
    useTestDc,
    readOnly: false,
    instanceName: useTestDc ? "tdlib_test" : "tdlib",
    apiId: parseInt(process.env.REACT_APP_APP_ID!),
    apiHash: process.env.REACT_APP_API_HASH,
    jsLogVerbosityLevel: "info",
    logVerbosityLevel: 1,
    useDatabase: true,
    useFileDatabase: true,
    useChatInfoDatabase: true,
    useMessageDatabase: true,
    useSecretChats: false,
};

export class AirgramFactory {
    current?: Airgram;

    async makeAsync() {
        if (this.current) {
            await this.current.api.destroy();
        }

        const newInstance = new Airgram(options);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.current = newInstance;

        return newInstance;
    }
}
