import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppConfig } from "../shared/config";

const Settings: React.FC = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [key, setKey] = useState("");
    const [modifiers, setModifiers] = useState({
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
    });

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await window.electronAPI.getConfig();
                setConfig(config);
                setKey(config.hotkey.key);

                const safeModifiers = {
                    ctrl: Boolean(config.hotkey.modifiers.ctrl),
                    alt: Boolean(config.hotkey.modifiers.alt),
                    shift: Boolean(config.hotkey.modifiers.shift),
                    meta: Boolean(config.hotkey.modifiers.meta),
                };

                setModifiers(safeModifiers);
            } catch (error) {
                console.error("Failed to load config:", error);
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, []);

    const saveConfig = async () => {
        if (!config) return;

        setSaving(true);
        try {
            const newConfig: Partial<AppConfig> = {
                hotkey: {
                    key,
                    modifiers,
                },
            };

            const updatedConfig = await window.electronAPI.updateConfig(
                newConfig
            );
            setConfig(updatedConfig);
        } catch (error) {
            console.error("Failed to save config:", error);
        } finally {
            setSaving(false);
        }
    };

    // Handle key recording
    const recordHotkey = () => {
        const oldKey = key;
        const oldModifiers = { ...modifiers };

        setKey("Press a key...");

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            // Don't capture modifier keys on their own
            if (
                ["Control", "Alt", "Shift", "Meta", "Command"].includes(e.key)
            ) {
                return;
            }

            const newModifiers = {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                meta: e.metaKey,
            };

            let capturedKey = e.key;
            if (capturedKey.length === 1) {
                capturedKey = capturedKey.toUpperCase();
            }

            setKey(capturedKey);
            setModifiers(newModifiers);

            // Remove the event listener
            window.removeEventListener("keydown", handleKeyDown);
        };

        window.addEventListener("keydown", handleKeyDown);

        // If focus is lost, restore old values
        const handleBlur = () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("blur", handleBlur);

            if (key === "Press a key...") {
                setKey(oldKey);
                setModifiers(oldModifiers);
            }
        };

        window.addEventListener("blur", handleBlur);
    };

    if (loading) {
        return <div className="text-white">Loading settings...</div>;
    }

    if (!config) {
        return <div className="text-white">Error loading settings</div>;
    }

    return (
        <div className="p-4 bg-opacity-95 text-white max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Settings</h2>
                <Link
                    to="/"
                    className="text-gray-300 hover:text-white text-sm flex items-center"
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back
                </Link>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Global Hotkey</h3>
                <div className="flex flex-col space-y-2">
                    <div
                        className="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer"
                        onClick={recordHotkey}
                    >
                        <span>Hotkey to show/hide:</span>
                        <div className="p-1 bg-gray-600 rounded flex items-center space-x-1">
                            {modifiers.ctrl && (
                                <span className="px-1 bg-gray-500 rounded">
                                    Ctrl
                                </span>
                            )}
                            {modifiers.alt && (
                                <span className="px-1 bg-gray-500 rounded">
                                    Alt
                                </span>
                            )}
                            {modifiers.shift && (
                                <span className="px-1 bg-gray-500 rounded">
                                    Shift
                                </span>
                            )}
                            {modifiers.meta && (
                                <span className="px-1 bg-gray-500 rounded">
                                    ⌘
                                </span>
                            )}
                            {key !== "Press a key..." && (
                                <span className="px-1 bg-gray-500 rounded">
                                    {key}
                                </span>
                            )}
                            {key === "Press a key..." && (
                                <span className="text-gray-400 italic">
                                    {key}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400">
                        Click above to record a new hotkey combination. Press
                        any letter key with modifiers.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <button
                    className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium disabled:opacity-50"
                    onClick={saveConfig}
                    disabled={saving || key === "Press a key..."}
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
