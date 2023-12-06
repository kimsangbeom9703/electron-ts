import {app, BrowserWindow} from "electron";
import * as path from "path";

function createWindow() {
    // Create the browser window.
    const mainWindow: BrowserWindow = new BrowserWindow({
        height: 1600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", (): void => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});