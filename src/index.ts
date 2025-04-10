import { app, BrowserWindow, globalShortcut, screen } from "electron";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = (): void => {
    // Get primary display dimensions
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width } = primaryDisplay.workAreaSize;

    // Calculate position (right upper corner)
    const windowWidth = 400;
    const windowHeight = 400;
    const xPosition = width - windowWidth - 20; // 20px margin from right edge
    const yPosition = 20; // 40px from top

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: windowHeight,
        width: windowWidth,
        x: xPosition,
        y: yPosition,
        frame: false, // No window frame/chrome
        transparent: true, // Allows transparent background
        resizable: false,
        show: false, // Initially hidden
        alwaysOnTop: true, // Ensures window appears on top
        skipTaskbar: true, // Doesn't show in taskbar
        center: false, // Don't center since we're setting position manually
        fullscreenable: true,
        focusable: true, // Required to accept input
        hasShadow: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Register the Control+Q global shortcut
    globalShortcut.register("Control+Q", () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            // Show and focus to allow typing
            mainWindow.show();
            mainWindow.focus();

            // Ensure it remains on top after showing
            mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
        }
    });

    // macOS specific behavior
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Make sure to unregister shortcuts when quitting
app.on("will-quit", () => {
    try {
        globalShortcut.unregisterAll();
    } catch (error) {
        // Silently fail if there's an error during cleanup
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
