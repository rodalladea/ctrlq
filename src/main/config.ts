import Store from "electron-store";
import {
    AppConfig,
    DEFAULT_CONFIG,
    hotkeyToAccelerator,
} from "../shared/config";

// Extend the Store type to include the get and set methods
interface TypedStore<T> extends Store {
    get: <K extends keyof T>(key: K) => T[K];
    set: <K extends keyof T>(key: K, value: T[K]) => void;
    store: T;
}

/**
 * Configuration service for the main process
 */
class ConfigService {
    private store: TypedStore<AppConfig>;
    private config: AppConfig;

    constructor() {
        // Initialize store with default values
        this.store = new Store<AppConfig>({
            defaults: DEFAULT_CONFIG,
            name: "ctrlq-config", // Name of the config file
        }) as TypedStore<AppConfig>;

        // Load current config or use defaults
        this.config = this.getConfigFromStore();
    }

    /**
     * Get the current application configuration
     */
    getConfig(): AppConfig {
        return this.config;
    }

    /**
     * Update the configuration
     */
    updateConfig(newConfig: Partial<AppConfig>): AppConfig {
        // Deep merge the new config with the current one
        this.config = this.mergeConfigs(this.config, newConfig);

        // Save to disk
        this.saveConfigToStore();

        return this.config;
    }

    /**
     * Get the global shortcut as an Electron accelerator string
     */
    getGlobalShortcut(): string {
        return hotkeyToAccelerator(this.config.hotkey);
    }

    /**
     * Deep merge two config objects
     */
    private mergeConfigs(
        target: AppConfig,
        source: Partial<AppConfig>
    ): AppConfig {
        const result = { ...target };

        if (source.hotkey) {
            result.hotkey = {
                ...target.hotkey,
                ...source.hotkey,
                modifiers: {
                    ...target.hotkey.modifiers,
                    ...(source.hotkey.modifiers || {}),
                },
            };
        }

        return result;
    }

    /**
     * Get the configuration from the store
     */
    private getConfigFromStore(): AppConfig {
        return this.store.store;
    }

    /**
     * Save the configuration to the store
     */
    private saveConfigToStore(): void {
        this.store.store = this.config;
    }
}

// Export a singleton instance
export const configService = new ConfigService();
