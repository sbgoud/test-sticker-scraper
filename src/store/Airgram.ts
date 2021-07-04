import { Airgram, AirgramConfig } from "@airgram/web";

const options: AirgramConfig = {
    apiId: parseInt(process.env.REACT_APP_APP_ID!),
    apiHash: process.env.REACT_APP_API_HASH,
    jsLogVerbosityLevel: "info",
    logVerbosityLevel: 2,
};

export default new Airgram(options);
