$(function(){
    var ipcRenderer = require('electron').ipcRenderer;
    var remote=require('electron').remote;
    var	BrowserWindow =remote.BrowserWindow;
    var win = BrowserWindow.getFocusedWindow();
    var path = require('path');
    var Menu = remote.Menu;
    var Tray =remote.require('tray');
    var ico = path.join(__dirname, 'img', 'Genius.png');
    var trayIcon = new Tray(ico);
    var trayMenuTemplate = [
        { label: '锁定',
            accelerator: 'Command+Q',
            selector: 'terminate:',
            click: function() {
                app.quit();
            }
        }
    ];
    var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    trayIcon.setContextMenu(trayMenu);
    $(document).on('click', '#close', function(){
        if(win){
            win.close();
        }
    });
    $(document).on('click', '#min', function(){
        if(win){

            win.minimize();
        }
    });
    var messWindow;
    $(document).on('dblclick', '.list dd', function(){
        var nickname = $(this).find('.nickname').text();
        if(messWindow){
            messWindow.show();
        }else{
            messWindow = new BrowserWindow({
                width: 700
                ,height: 510
                ,minWidth: 700
                ,minHeight: 510
                ,maxWidth: 700
                ,maxHeight: 510
                ,frame: false,
                icon:path.join(__dirname, 'img', 'Genius.png')
            });
            messWindow.loadUrl('file://' + __dirname + '/singlechat.html');
            messWindow.show();
            messWindow.webContents.send('transfer:name', name);
            messWindow.on("closed",function(){
                messWindow=null;
            });
        }
        //messWindow.webContents.openDevTools();
    });
});
(function ($) {
    var d = document,
        from,
        to,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd: db,
        ec = encodeURIComponent;
    var user  = window.localStorage.getItem('userName');

    w.CHAT = {
        msgObj:d.getElementById("message"),
        screenheight:w.innerHeight ? w.innerHeight : dx.clientHeight,
        username:null,
        userid:null,
        socket:null,
        //退出，本例只是一个简单的刷新
        logout:function(){
            location.reload();
        },
        genUid:function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        },
        //更新系统消息，本例中在用户加入、退出的时候调用
        updateSysMsg:function(o, action){
            //当前在线用户列表
            var onlineUsers = o.onlineUsers;
            //当前在线人数
            var onlineCount = o.onlineCount;
            //新加入用户的信息
            var user = o.user;

            var html = '<dd><img src="img/logo.png"><span class="nickname">'+user.username+'</span>'+
                '<span class="lastmess">Genius Talk 的最新版本再发一下！</span><i class="badge" style="display:none">0</i></dd>';
            $('.conver').append(html);
            //更新在线人数
            // $('.conver').empty();
            // for(key in onlineUsers) {
            //        if(onlineUsers.hasOwnProperty(key)){
            // 		var html = '<dd><img src="../images/logo.png"><span class="nickname">'+onlineUsers[key]+'</span>'+
            //              	   '<span class="lastmess">Genius Talk 的最新版本再发一下！</span><i class="badge">0</i></dd>';
            //              	$('.conver').append(html);
            // 	}
            //    }
        },
        updateSysFirends:function(firends){
            var html=""
            for(var i=0;i<firends.length;i++){
                var firend=firends[i];
                 html += '<dd ><img src="img/logo.png"><span class="nickname">'+firend.name+'</span>'+
                    '<span class="lastmess">Genius Talk 的最新版本再发一下！</span></dd>';
            }
            $('.conver').append(html);
        },
        //第一个界面用户提交用户名
        usernameSubmit:function(){
            var username = user;
            if(username != ""){
                this.init(username);
            }
            return false;
        },
        init:function(username){
            /*
             客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
             实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
             */
            this.userid = this.genUid();
            this.username = username;

            // d.getElementById("showusername").innerHTML = this.username;
            // this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
            // this.scrollToBottom();

            //连接websocket后端服务器
            this.socket = io.connect('http://127.0.0.1:3000');

            //告诉服务器端有用户登录
            this.socket.emit('getFirends', {userid:this.userid, username:this.username});

            //获取朋友
            this.socket.on('firendResult', function(response){
                console.log(response)
               if(response&&response.length>0){
                   CHAT.updateSysFirends(response);
               }
            });

            //监听用户退出
            this.socket.on('logout', function(o){
                CHAT.updateSysMsg(o, 'logout');
            });
            //监听消息发送
            this.socket.on('message', function(obj){
                var odd = $('.conver').find('dd');
                $.each(odd,function(index, item){
                    $(this).find('.badge').show();
                    var text = parseInt($(this).find('.badge').text()) + 1;
                    $(this).find('.badge').text(text);
                    $(this).find('.lastmess').text(obj.content);
                });
                console.log("objContent:" + obj.content);
            });
        }
    };
    w.CHAT.usernameSubmit();
})(Zepto);