const { contextBridge, ipcRenderer } = require("electron");

const api = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    openLink: (url) => ipcRenderer.send('open-external-browser', url),
    restart: () => ipcRenderer.invoke('restart'),
    quit: ()=>ipcRenderer.invoke('quit-app'),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, percent) => callback(percent)),
    requestDownload: () => ipcRenderer.send('download-update'),
    requestInstall: () => ipcRenderer.send('install-update') 
}

contextBridge.exposeInMainWorld('app', api);