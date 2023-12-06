import {app, BrowserWindow} from "electron";
import * as path from "path";
import { generateCertificates } from './modules/mkcert';

import './app/index'; // webserver
//app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

console.log(process.cwd())

function createWindow() {
    // Create the browser window.
    const mainWindow: BrowserWindow = new BrowserWindow({
        width: 800,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // contextIsolation이 꺼져있어야 CSP가 적용됨
            sandbox: false, // contextIsolation이 꺼져있어야 sandbox가 꺼짐
            webSecurity: true, // 필요에 따라 웹 보안 설정을 true로 유지
            preload: path.join(__dirname, 'preload.js') // 필요에 따라 preload 스크립트 추가
        },
    });
    // 보안 정책 설정 - "unsafe-eval" 사용 안 함
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["script-src 'self'"] // 여기서 'unsafe-eval'을 제거하고 적절한 정책으로 대체
            }
        });
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../views/index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    generateCertificates();
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
