'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var mainWindow = null;
require('crash-reporter').start();
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function() {
    var ico = path.join(__dirname, 'app/img', 'Genius.png');
    mainWindow = new BrowserWindow({
        width: 430
        ,height: 330
        ,frame: false
        ,resizable: true
        ,icon: ico
        ,show:false
    });
    mainWindow.loadUrl('file://' + __dirname + '/login.html');
    mainWindow.show();
    //mainWindow.webContents.openDevTools();
});