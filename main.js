const { app, BrowserWindow, dialog, ipcMain, powerMonitor } = require('electron/main')
const { shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const electronReload = require('electron-reload')(__dirname);
const lock = app.requestSingleInstanceLock();
if (!lock) { app.quit(); return };
const path = require('node:path');
const log = require('electron-log');
const clg = console.log;
const { createMenu } = require('./menu');
const { error } = require('node:console');
log.transports.file.resolvePathFn = () => path.resolve('C:/Users/RAJ/Documents/GitHub/ebs_app_v2', 'main.log');
require('./server');

console.log(app.getPath('appData'));

let win;
function createWindow() {
    const appVersion = app.getVersion(); //console.log(appVersion)
    createMenu();
    win = new BrowserWindow({
        width: 1360,
        height: 768,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        title: `EBS - v${appVersion}`,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })
    win.loadFile(path.join(__dirname, 'public', 'index.html'));
    // win.loadURL('http://localhost:3641')
    return win;
}

app.on('ready', () => {
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

ipcMain.on('open-external-browser', (e, url) => { shell.openExternal(url) });

ipcMain.handle('printAndClose', async (e, { url, printer }) => {
    let newWindow = new BrowserWindow({
        width: 400,
        height: 800,
        minWidth: 400,
        minHeight: 400,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    await newWindow.loadURL(url);
    
    newWindow.once('ready-to-show', () => {
        setTimeout(function () {
            newWindow.webContents.print({
                silent: true,
                deviceName: printer,
                margins: { marginType: 'default' }
            }, (success, errorType) => {
                if (!success) {
                    console.error(errorType);
                } else {
                    // Close the window after printing
                    newWindow.close();
                }
            });
        }, 1000)
    })
    newWindow.on('closed', () => {
        newWindow = null;
    });

    // Optionally, you can use 'closed' event to clean up resources
    // newWindow.on('closed', () => {
    //   newWindow = null;
    // });

});


ipcMain.handle('setPrinter', async (e) => {
    let mainWindow = BrowserWindow.getFocusedWindow();
    let printers = await mainWindow.webContents.getPrintersAsync(); //log(printers.name);
    let printerNames = printers.map(printer => printer.name); //log(printerNames);
    printerNames.push('Cancel');
    let { response } = await dialog.showMessageBox(null, {
        type: 'question',
        buttons: printerNames,
        title: 'Select a printer',
        icon: null,
    });
    let selectedPrinter = printers[response];
    //check for cancel button
    if (response === printerNames.length - 1) { return }
    return selectedPrinter.name;
})

ipcMain.handle('printPage', async (e, printer) => {
    const window = BrowserWindow.getFocusedWindow();
    return new Promise((resolve, reject) => {
        window.webContents.print({
            silent: true,
            deviceName: printer,
            margins: { marginType: 'default' },
        }, (success, errorType) => {
            if (!success) {
                console.error(errorType);
                reject(false)
            } else {
                resolve(true)
            }
        });
    })
});

ipcMain.handle('printA4', async (e, printer) => {
    BrowserWindow.getFocusedWindow().webContents.print({
        silent: true,
        deviceName: printer,
        margins: { marginType: "default" },
        pagesPerSheet: 1,
        pageSize: "A4",
    }, (success, errorType) => {
        if (!success) {
            console.error(errorType);
        }
    })
})

ipcMain.handle('printA5', async (e, printer) => {
    BrowserWindow.getFocusedWindow().webContents.print({
        silent: true,
        deviceName: printer,
        margins: { marginType: "default" },
        pagesPerSheet: 1,
        pageSize: "A5",
    }, (success, errorType) => {
        if (!success) {
            console.error(errorType);
        }
    })
})