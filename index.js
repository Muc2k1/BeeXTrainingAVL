const express = require('express');
const app = express();
const path = require('path');

const mysql = require('./models/DbConnection')

app.set('view engine', 'ejs');
app.set('views', './views')

const route = require('./routes/index.route.js')

const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//connect
mysql.dbconnect();

const player = require('./models/PlayerModel')
//---


io.on('connection', (socket, io) => {
    let pname;
    let proom;
    let pid;

    console.log("player: " + socket.id + " connected");

    socket.on('client-gui-thong-tin-khoi-tao', function (data) {
        pname = data.name;
        proom = data.room;
        pid = socket.id;

        // console.log("room check is: " + checkRoom(proom))
        // createPlayer();
        player.addPlayer(pid, pname, proom);

        socket.join(proom)
        socket.leave(socket.id)

        //lấy danh sách người chơi trong phòng đó
        let membersArray = [];
        let membersName = [];

        player.getPlayersInRoom(proom, membersArray, membersName, (mN) => {
            socket.to(proom).emit('server-gui-cap-nhat-khung-nhin', mN);
        }, () => {
            socket.to(proom).emit('server-yeu-cau-hien-thi-nut-play');
        }, () => {
            socket.to(proom).emit('server-yeu-cau-dung-hien-thi-nut-play');
        })

        //du lieu nay chi de render, hoac tuong lai se k xai, chi xai csdl, nhung v code hoi nhieu
        socket.on('disconnect', () => {
            player.deletePlayer(pid);

            player.getPlayersInRoom(proom, membersArray, membersName, (mN) => {
                socket.to(proom).emit('server-gui-cap-nhat-khung-nhin', mN);
            }, () => {
                socket.to(proom).emit('server-yeu-cau-hien-thi-nut-play');
            }, () => {
                socket.to(proom).emit('server-yeu-cau-dung-hien-thi-nut-play');
            })

            // xem xet phong nao k con nguoi choi thi xoa
            socket.leave(proom)
        })
    })


})

route(app);

app.use(express.static(path.join(__dirname, '/public')))

server.listen(9090)