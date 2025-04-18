/**
 * Configuration types shared between main and renderer processes
 */

export interface AppConfig {
    hotkey: {
        key: string;
        modifiers: {
            ctrl?: boolean;
            alt?: boolean;
            shift?: boolean;
            meta?: boolean;
        };
    };
}

export const DEFAULT_CONFIG: AppConfig = {
    hotkey: {
        key: "Q",
        modifiers: {
            ctrl: true,
            alt: false,
            shift: false,
            meta: false,
        },
    },
};

/**
 * Converts the hotkey configuration to an Electron accelerator string
 */
export function hotkeyToAccelerator(hotkey: AppConfig["hotkey"]): string {
    const modifiers: string[] = [];

    if (hotkey.modifiers.ctrl) modifiers.push("Control");
    if (hotkey.modifiers.alt) modifiers.push("Alt");
    if (hotkey.modifiers.shift) modifiers.push("Shift");
    if (hotkey.modifiers.meta) modifiers.push("Meta");

    return [...modifiers, hotkey.key].join("+");
}

/**
 * Converts an Electron accelerator string to our hotkey format
 */
export function acceleratorToHotkey(accelerator: string): AppConfig["hotkey"] {
    const parts = accelerator.split("+");
    const key = parts.pop() || "";

    return {
        key,
        modifiers: {
            ctrl: parts.includes("Control"),
            alt: parts.includes("Alt"),
            shift: parts.includes("Shift"),
            meta: parts.includes("Meta"),
        },
    };
}
