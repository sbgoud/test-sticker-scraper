import { AirgramCore, Config, ProviderFactory } from "@airgram/core";
import { TdWebProviderConfig } from "@airgram/web";
import { AirgramProvider } from "./AirgramProvider";

export interface AirgramConfig extends Config, TdWebProviderConfig {}

export class Airgram extends AirgramCore<AirgramProvider> {
    public constructor(config: AirgramConfig) {
        const {
            instanceName,
            isBackground,
            jsLogVerbosityLevel,
            logVerbosityLevel,
            mode,
            readOnly,
            useDatabase,
            ...baseConfig
        } = config;
        const providerFactory: ProviderFactory<AirgramProvider> = (handleUpdate) => {
            const provider = new AirgramProvider({
                instanceName,
                isBackground,
                jsLogVerbosityLevel,
                logVerbosityLevel,
                mode,
                readOnly,
                useDatabase,
            });
            provider.initialize(handleUpdate);
            return provider;
        };
        super(providerFactory, baseConfig);
    }
}
