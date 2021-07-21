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
const demo = require('./models/DemoruleModel')

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
        let roleArray = [];
        player.getIdsInRoom(proom, (mI, mN) => {
            demo.getRuleString(mI.length, (result) => {
                roleArray = [...result];
                let membersWithRole = []; //Dung de render
                let nOP = roleArray.length;
                for (let j = 0; j < nOP; j++) {
                    let randRole = Math.floor(Math.random() * roleArray.length);
                    membersWithRole.push({ name: mN[j], player: mI[j], role: roleArray[randRole] })
                    player.addRole(mI[j], roleArray[randRole]);
                    socket.to(proom).emit('server-gui-role', membersWithRole[j]);
                    roleArray.splice(randRole, 1);

                    socket.to(proom).emit('server-yeu-cau-cap-nhat-player-list', membersWithRole);
                }
                //xử lí game ở đây
                let randLeader = Math.floor(Math.random() * membersWithRole.length);
                socket.to(proom).emit('server-gui-yeu-cau-teamup', membersWithRole[randLeader].player);
            });
        })
    })
    socket.on('client-teamup-fb', (teamdata) => {
        socket.to(proom).emit('server-gui-thong-tin-teamup', teamdata);
    })
    socket.on('client-vote-team-fb', (data) => {
        socket.to(proom).emit('server-vote-team-fb-cho-host', data);
    })
    socket.on('host-gui-ket-qua-vote', (data) => {
        socket.to(proom).emit('server-vote-team-fb', data);
    })
    socket.on('host-gui-yeu-cau-vote-thanh-cong', (gamedata)=>{
        //handle
        console.log("vote thanh cong")
    })
    socket.on('host-gui-yeu-cau-vote-lai', (gamedata)=>{
        //handle
        console.log("vote that bai")
        setTimeout( ()=>{
            let randLeader = Math.floor(Math.random() * gamedata.length);
            socket.to(proom).emit('server-gui-yeu-cau-teamup', gamedata[randLeader].player);
        } , 5000)
    })
    //game start
    //round = 1, deathcount = 0, chon ngau nhien 1 nguoi choi lam leader
    //nguoi choi duoc RENDER nhiem vu: "chon n nguoi choi de lap team" (bang checkbox)->nhan ACCEPT
    //moi nguoi duoc RENDER ra team dang duoc ghep->vote cong khai
    //neu that bai: chon nguoi choi khac lam leader (deathcount ++ , deathcount == 5 => game end)
    //neu thanh congn: (deathcount = 0)RENDER nhiem vu cho team duoc ghep
    //RENDER mang hinh cho cho m.n->team vote kin
    //RENDER ket qua cho mn, luu kq vao csdl
    //round ++;
})

route(app);

app.use(express.static(path.join(__dirname, '/public')))

server.listen(9090)