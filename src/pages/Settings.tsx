import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppConfig } from "../shared/config";
import { ArrowLeft, Folder } from "lucide-react";

const Settings: React.FC = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [key, setKey] = useState("");
    const [defaultFolder, setDefaultFolder] = useState("");
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
                setDefaultFolder(config.defaultFolder || "");

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
                defaultFolder,
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

    const handleSelectFolder = async () => {
        try {
            const result = await window.electronAPI.selectFolder();
            if (result) {
                setDefaultFolder(result);
            }
        } catch (error) {
            console.error("Failed to select folder:", error);
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
                <div className="flex items-center space-x-3">
                    <Link
                        to="/"
                        className="text-zinc-300 hover:text-white text-sm flex items-center"
                    >
                        <ArrowLeft strokeWidth={3} className="w-4 h-4 mr-1" />
                        Back
                    </Link>
                    <button
                        className="cursor-pointer px-2 py-1 text-sm text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded disabled:opacity-50"
                        onClick={saveConfig}
                        disabled={saving || key === "Press a key..."}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold">Default Folder</h3>
                <p className="text-xs text-zinc-400 mb-3">
                    The default folder to open when the app is launched.
                </p>
                <div className="flex items-center space-x-2">
                    <div className="w-full p-2 text-sm bg-zinc-800 rounded">
                        {defaultFolder || "Select a folder..."}
                    </div>
                    <button
                        onClick={handleSelectFolder}
                        className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm flex items-center"
                    >
                        <Folder className="w-4 h-4 mr-1" />
                        Browse
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold">Global Hotkeys</h3>
                <p className="text-xs text-zinc-400 mb-3">
                    Click on the respective hotkey to record a new hotkey
                    combination.
                </p>
                <div className="flex flex-col space-y-2">
                    <div
                        className="flex items-center justify-between p-2 bg-zinc-800 rounded cursor-pointer"
                        onClick={recordHotkey}
                    >
                        <span>Hotkey to show/hide:</span>
                        <div className="p-1 rounded flex items-center space-x-1">
                            {modifiers.ctrl && key !== "Press a key..." && (
                                <span className="px-1 bg-zinc-500 rounded">
                                    Ctrl
                                </span>
                            )}
                            {modifiers.alt && key !== "Press a key..." && (
                                <span className="px-1 bg-zinc-500 rounded">
                                    Option
                                </span>
                            )}
                            {modifiers.shift && key !== "Press a key..." && (
                                <span className="px-1 bg-zinc-500 rounded">
                                    Shift
                                </span>
                            )}
                            {modifiers.meta && key !== "Press a key..." && (
                                <span className="px-1 bg-zinc-500 rounded">
                                    ⌘
                                </span>
                            )}
                            {key !== "Press a key..." && (
                                <span className="px-1 bg-zinc-500 rounded">
                                    {key}
                                </span>
                            )}
                            {key === "Press a key..." && (
                                <span className="text-zinc-400 italic">
                                    {key}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
