import { AppConfig } from "../shared/config";

declare global {
    interface Window {
        electronAPI: {
            getConfig: () => Promise<AppConfig>;
            updateConfig: (config: Partial<AppConfig>) => Promise<AppConfig>;
            onNavigateToSettings: (callback: () => void) => void;
            selectFolder: () => Promise<string | undefined>;
            newFile: (folder: string) => Promise<string>;
            listFiles: (folder: string) => Promise<string[]>;
            readFile: (filePath: string) => Promise<string>;
            writeFile: (filePath: string, content: string) => Promise<void>;
            deleteFile: (filePath: string) => Promise<void>;
        };
    }
}

export {};
