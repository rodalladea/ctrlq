import { AppConfig } from "../shared/config";

declare global {
    interface Window {
        electronAPI: {
            getConfig: () => Promise<AppConfig>;
            updateConfig: (config: Partial<AppConfig>) => Promise<AppConfig>;
        };
    }
}

export {};
