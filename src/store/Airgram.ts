import { Airgram, AirgramConfig } from "@airgram/web";

const options: AirgramConfig = {
    //useTestDc: true,
    apiId: parseInt(process.env.REACT_APP_APP_ID!),
    apiHash: process.env.REACT_APP_API_HASH,
    jsLogVerbosityLevel: "error",
    logVerbosityLevel: 0,
    useSecretChats: false,
};

let prevInstance: Airgram | undefined = undefined;

export default async function createAirgram() {
    if (prevInstance) {
        await prevInstance.api.destroy();
    }

    const newInstance = new Airgram(options);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prevInstance = newInstance;

    return newInstance;
}
