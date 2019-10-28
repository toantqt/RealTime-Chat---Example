const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var port = 9999;

app.use(express.static("./public"));
app.set('view engine', 'hbs');
app.set("views", "./views");

var Users = [];
io.on("connection", (socket) => {
    console.log('New connect: '+socket.id);
    
    //listen client-username
    socket.on('client-username', (data) => {
        console.log(data);

        if(Users.indexOf(data) >=0 ){
            socket.emit('server-send-fail', data);
        }
        else if(data == ""){
            socket.emit('server-send-fail', data);
        }
        else{
            Users.push(data);

            //save data => Username
            socket.Username = data;

            //server send success
            socket.emit('server-send-success', data);

            //send all user
            io.sockets.emit('server-send-usersOnline', Users);

            //listen client send msg
            socket.on("client-send-msg", (data) => {
                console.log(data);

                //server send message client
                io.sockets.emit('server-send-msg', {
                    name: socket.Username,
                    msg: data
                })
            })
            
            //client logout
            socket.on('logout', () => {
                Users.splice(Users.indexOf(data),1);

                socket.broadcast.emit('server-send-usersOnline', Users);

                //msg thong bao client log out
                socket.broadcast.emit('server-send-msg', {
                    name: socket.Username,
                    msg: 'Đã thoát'
                })

                
            });
        }

    });
})


app.get('/', (req, res) => {
    res.render('home');
});

server.listen(port, () => {
    console.log('Server on port '+port);
});