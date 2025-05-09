// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { AppConfig } from "./shared/config";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    getConfig: async (): Promise<AppConfig> => {
        return await ipcRenderer.invoke("get-config");
    },
    updateConfig: async (config: Partial<AppConfig>): Promise<AppConfig> => {
        return await ipcRenderer.invoke("update-config", config);
    },
    onNavigateToSettings: (callback: () => void) => {
        ipcRenderer.on("navigate-to-settings", callback);
    },
    selectFolder: async (): Promise<string | undefined> => {
        return await ipcRenderer.invoke("select-folder");
    },
    newFile: async (folder: string): Promise<string> => {
        return await ipcRenderer.invoke("new-file", folder);
    },
    listFiles: async (folder: string): Promise<string[]> => {
        return await ipcRenderer.invoke("list-files", folder);
    },
    readFile: async (filePath: string): Promise<string> => {
        return await ipcRenderer.invoke("read-file", filePath);
    },
    writeFile: async (filePath: string, content: string): Promise<void> => {
        return await ipcRenderer.invoke("write-file", filePath, content);
    },
    deleteFile: async (filePath: string): Promise<void> => {
        return await ipcRenderer.invoke("delete-file", filePath);
    },
    renameFile: async (oldPath: string, newPath: string): Promise<void> => {
        return await ipcRenderer.invoke("rename-file", oldPath, newPath);
    },
});
