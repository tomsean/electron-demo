$(function(){
	var remote=require('electron').remote;
    var	app = remote.app;
	var ipcRenderer = require('electron').ipcRenderer;
	var	BrowserWindow =require('electron').remote.BrowserWindow;
	var win = BrowserWindow.getFocusedWindow();
	var path = require('path');
	var Menu = remote.Menu;
	var Tray =remote.require('tray');
	var ico = path.join(__dirname, 'images', 'Genius.png');
	trayIcon = new Tray(ico);
	var trayMenuTemplate = [
		{ label: '退出',
			accelerator: 'Command+Q',
			selector: 'terminate:',
			click: function() {
				app.quit();
			}
		}
	];
	var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
	trayIcon.setContextMenu(trayMenu);
	$(document).on('click', '#close', function () {
		if(win){
			win.close();
		}
	});
	$(document).on('click', '#min', function () {
		if(win){
			win.minimize();
		}
	});
	$(document).on('click', '.btn-primary', function () {
		var user = $('.user').val();
		// var pass = $('.pwdInput').val();
		window.localStorage.setItem('userName', user);
		var commWindow = new BrowserWindow({
			width: 300
			,height: 900
			,x: 1500
			,y: 30
			,min_width: 260
			,min_height: 600
			,max_width: 550
			,max_height: 900
			,frame: false,
			icon:path.join(__dirname, 'images', 'Genius.png')
		});
		commWindow.loadUrl('file://' + __dirname + '/pages/comm.html');
		commWindow.show();
		commWindow.webContents.openDevTools();
		win.close();
	});
});
