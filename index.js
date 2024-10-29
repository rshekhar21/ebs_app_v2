const { app, BrowserWindow, dialog, ipcMain, powerMonitor } = require('electron/main')
const { autoUpdater } = require('electron-updater');
const electronReload = require('electron-reload')(__dirname);
const lock = app.requestSingleInstanceLock();
if (!lock) { app.quit(); return };
const path = require('node:path');
const log = require('electron-log');
log.transports.file.resolvePathFn = () => path.resolve('C:/Users/RAJ/Documents/GitHub/ebs_app_v2', 'main.log');
require('./server');

let win;
function createWindow() {
    const appVersion = app.getVersion(); //console.log(appVersion)
    win = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        title: `EBS - v${appVersion}`, 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })
    // win.loadFile(path.join(__dirname, 'public', 'index.html'));
    win.loadURL('http://localhost:3641')
    return win;
}

app.on('ready', ()=>{
    createWindow();
    autoUpdater.checkForUpdates();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

autoUpdater.on('update-available', () => {
    log.info('Update available.');
    win.webContents.send('update-available');
});

ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate();
});

autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
});

autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
});

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})