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
const rule = require('./models/RuleModel')

//socket.io
io.on('connection', (socket, io) => {
    let pname;
    let proom;
    let pid;
    let nOTeammate = 2;

    console.log("player: " + socket.id + " connected");

    socket.on('client-gui-thong-tin-khoi-tao', function (data) {
        pname = data.name;
        proom = data.room;
        pid = socket.id;
        socket.emit('server-xac-nhan-id', pid);

        rooms.checkRoom(proom, pid, (result) => {
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

            rooms.immaHost(proom, pid,(result)=>{
                if(result){
                    socket.to(proom).emit('server-send-host-is-disconnect');
                }
                else{
                    player.getPlayersInRoom(proom, membersName, (mN) => {
                        socket.to(proom).emit('server-gui-cap-nhat-khung-nhin', mN);
                    }, () => {
                        socket.to(proom).emit('server-yeu-cau-hien-thi-nut-play');
                    }, () => {
                        socket.to(proom).emit('server-yeu-cau-dung-hien-thi-nut-play');
                    })
                    socket.leave(proom)
                }
            })
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
                rooms.getRound(proom, (round) => {
                    rule.getMPM(round, membersWithRole.length, (mpm) => {
                        console.log(mpm);
                        let randLeader = Math.floor(Math.random() * membersWithRole.length);
                        socket.to(proom).emit('server-gui-yeu-cau-teamup', [membersWithRole[randLeader].player, mpm]);
                        rooms.nextRound(proom);
                    })
                })
            });
        })
    })
    socket.on('client-teamup-fb', (teamdata) => {
        socket.to(proom).emit('server-gui-thong-tin-teamup', teamdata);
    })
    socket.on('client-vote-team-fb', (data) => {
        socket.to(proom).emit('server-vote-team-fb-cho-host', data);
    })
    socket.on('host-gui-ket-qua-vote', (data) => { //[voteTeamResult, vr, chosenTeam, gameData]
        socket.to(proom).emit('server-vote-team-fb', data);
        if (data[1]) {
            console.log(data[2])
            socket.to(proom).emit('server-give-misson-screen', data[3]);
        } else {
            setTimeout(() => {
                let randLeader = Math.floor(Math.random() * data[3].length);
                socket.to(proom).emit('server-gui-yeu-cau-teamup', [data[3][randLeader].player, nOTeammate]);
                socket.to(proom).emit('server-send-death-vote-to-host');
            }, 5000)
        }
    })
    socket.on('client-vote-mission-fb', (voteR)=>{
        socket.to(proom).emit('server-send-vote-result-to-host', voteR);
    })
    socket.on('client-send-final-vote-result-to-host', (result)=>{
        socket.to(proom).emit('server-send-mission-final-result', result);
        socket.to(proom).emit('server-wait-for-host');
    })
    socket.on('client-send-fb-update-mission-info-to-players', (gameData)=>{
        rooms.getRound(proom, (round) => {
            rule.getMPM(round, gameData.length, (mpm) => {
                console.log(mpm);
                let randLeader = Math.floor(Math.random() * gameData.length);
                socket.to(proom).emit('server-gui-yeu-cau-teamup', [gameData[randLeader].player, mpm]);
                rooms.nextRound(proom);
            })
        })
    })
    socket.on('client-send-game-is-ending', (wincount)=>{
        console.log("end game")
        if(wincount>0){
            console.log("assassin last chance")
            socket.to(proom).emit('server-give-assassin-last-chance');
        }
        else{
            console.log("evil win")
            socket.to(proom).emit('server-decided-evil-win');
        }
    })
    socket.on('assassin-kill-seeker', ()=>{
        socket.to(proom).emit('server-decided-evil-win');
    })
    socket.on('assassin-not-kill-seeker', ()=>{
        socket.to(proom).emit('server-decided-human-win');
    })
    socket.on('client-has-vote-5-times-fail', ()=>{
        socket.to(proom).emit('server-decided-evil-win');
    })
})

route(app);

app.use(express.static(path.join(__dirname, '/public')))

server.listen(9090)