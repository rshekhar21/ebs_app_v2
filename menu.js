const { Menu, app, shell } = require("electron");

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit App',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) focusedWindow.reload();
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                    },
                },
                { type: 'separator' },
                {
                    role: 'resetzoom',
                },
                {
                    role: 'zoomin',
                },
                {
                    role: 'zoomout',
                },
                { type: 'separator' },
                {
                    role: 'togglefullscreen',
                },
            ],
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    role: 'minimize',
                },
                {
                    label: 'Maximize',
                    click: (_, focusedWindow) => {
                        if (focusedWindow) {
                            if (focusedWindow.isMaximized()) {
                                focusedWindow.unmaximize();
                            } else {
                                focusedWindow.maximize();
                            }
                        }
                    },
                },
                {
                    role: 'close',
                },
            ],
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        // const { shell } = require('electron');
                        await shell.openExternal('https://electronjs.org');
                    },
                },
            ],
        },
    ];

    // For macOS: Add the application menu
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        });

        // Add "Window" menu in macOS
        template[3].submenu = [
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
            { role: 'window' },
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = {
    createMenu,
}