import { AppConfig } from "../shared/config";

declare global {
    interface Window {
        electronAPI: {
            getConfig: () => Promise<AppConfig>;
            updateConfig: (config: Partial<AppConfig>) => Promise<AppConfig>;
            onNavigateToSettings: (callback: () => void) => void;
            selectFolder: () => Promise<string | undefined>;
        };
    }
}

export {};
