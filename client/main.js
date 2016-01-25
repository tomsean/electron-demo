var app = require('app');  
var ipc = require('electron').ipcMain;
var Tray = require('tray');
var Menu = require('menu');
var path = require('path');
var powerSaveBlocker = require('power-save-blocker');
var BrowserWindow = require('electron').BrowserWindow;
var dialog = require('electron').dialog;
// var $ = jQuery = require('jquery'); // as node_modules
// Report crashes to our server.
require('crash-reporter').start();
var loginWindow = null;
var appIcon = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
// app.on('closed')
app.on('ready', function() {
  var ico = path.join(__dirname, 'images', 'Genius.png');
  loginWindow = new BrowserWindow({
    width: 430
   ,height: 330
   ,frame: false
   ,resizable: true
   ,icon: ico
   ,show:false
  });
  //set tray icon
  loginWindow.loadUrl('file://' + __dirname + '/login.html');
  loginWindow.show();
  //loginWindow.webContents.openDevTools();
});

