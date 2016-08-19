var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    });

    mainWindow.loadURL('http://localhost:1337')

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})

var npmGuiServer = require('../npm-gui.js');
npmGuiServer();
