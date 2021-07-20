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
const rooms = require('./models/RoomModel')
const demo = require('./models/DemoModel')

//socket.io
io.on('connection', (socket, io) => {
    let pname;
    let proom;
    let pid;

    console.log("player: " + socket.id + " connected");

    socket.on('client-gui-thong-tin-khoi-tao', function (data) {
        pname = data.name;
        proom = data.room;
        pid = socket.id;
        socket.emit('server-xac-nhan-id', pid);

        rooms.checkRoom(proom, pid, () => {
            socket.emit('server-xac-nhan-host');
        });
        player.addPlayer(pid, pname, proom);

        socket.join(proom)
        socket.leave(socket.id)

        let membersName = [];

        player.getPlayersInRoom(proom, membersName, (mN) => {
            socket.to(proom).emit('server-gui-cap-nhat-khung-nhin', mN);
        }, () => {
            socket.to(proom).emit('server-yeu-cau-hien-thi-nut-play');
        }, () => {
            socket.to(proom).emit('server-yeu-cau-dung-hien-thi-nut-play');
        })
        socket.on('disconnect', () => {
            player.deletePlayer(pid);

            rooms.handleMember(proom, -1);

            player.getPlayersInRoom(proom, membersName, (mN) => {
                socket.to(proom).emit('server-gui-cap-nhat-khung-nhin', mN);
            }, () => {
                socket.to(proom).emit('server-yeu-cau-hien-thi-nut-play');
            }, () => {
                socket.to(proom).emit('server-yeu-cau-dung-hien-thi-nut-play');
            })
            socket.leave(proom)
        })
    })
    socket.on('client-start-game', () => {
        console.log("game bat dau")
        // let roleArray = ["Mực tiên tri", "Mực nô đùa", "Mực nô đùa", "Mực gian tà", "Mực the assassin"];
        let roleArray = [];
        player.getIdsInRoom(proom, (mI, mN) => {
            demo.getRuleString(mI.length, (result) => {
                roleArray = [...result];
                let membersWithRole = []; //Dung de render
                let nOP = roleArray.length;
                for (let j = 0; j < nOP; j++) {
                    let randRole = Math.floor(Math.random() * roleArray.length);
                    membersWithRole.push({ name: mN[j], player: mI[j], role: roleArray[randRole] })
                    socket.to(proom).emit('server-gui-role', membersWithRole[j]);
                    roleArray.splice(randRole, 1);

                    socket.emit('server-yeu-cau-cap-nhat-player-list', membersWithRole);
                }
                console.log(membersWithRole);
            });
            //lay chieu dai cua mI tim tren demoRule
            //ley ve chuoi roleString
            //tach chuoi roleString thanh mang roleArray

            // let membersWithRole = []; //Dung de render
            // let nOP = roleArray.length;
            // for (let j = 0; j < nOP; j++) {
            //     let randRole = Math.floor(Math.random() * roleArray.length);
            //     membersWithRole.push({ name: mN[j], player: mI[j], role: roleArray[randRole] })
            //     socket.to(proom).emit('server-gui-role', membersWithRole[j]);
            //     roleArray.splice(randRole, 1);

            //     socket.emit('server-yeu-cau-cap-nhat-player-list', membersWithRole);
            // }
            // console.log(membersWithRole);
        })
    })
})

route(app);

app.use(express.static(path.join(__dirname, '/public')))

server.listen(9090)