$(function(){
    var remote=require('electron').remote;
    var	app = remote.app;
    var	BrowserWindow= remote.BrowserWindow;
    var win = BrowserWindow.getFocusedWindow();
    var path = require('path');
    var Menu = remote.Menu;
    var Tray =remote.require('tray');
    var ico = path.join(__dirname, 'img', 'Genius.png');
    var trayIcon = new Tray(ico);
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
        window.close();
    });
    $(document).on('click', '#min', function () {
        if(win){
            win.minimize();
        }
    });
    $(document).on('click', '.btn-primary', function () {
        var qq = $('.user').val();
        var pass = $('.pwdInput').val();
        this.socket = io.connect('http://127.0.0.1:3000');
        this.socket.emit('login', {qq:qq, password:pass});
        this.socket.on('loginResult', function(result){
           if (result){
               openIndexPage();
           }else{
              alert("账号或密码错误")
           }
        });
    });
    function  openIndexPage(){
        var commWindow = new BrowserWindow({
            width: 300
            ,height: 600
            ,x: 800
            ,y: 30
            ,minWidth: 300
            ,minHeight: 500
            ,maxWidth: 550
            ,maxHeight: 700
            ,frame: false,
            icon:path.join(__dirname, 'img', 'Genius.png')
        });
        commWindow.loadUrl('file://' + __dirname + '/index.html');
        commWindow.show();
        commWindow.webContents.openDevTools();
        window.close();
        trayIcon.destroy();
    }
});
