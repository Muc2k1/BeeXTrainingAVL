const { clearCache } = require('ejs');
const mysql = require('./DbConnection')

let Player = {
    addPlayer: function (pid, pname, proom) {
        let data = { pid: pid, pname: pname, proom: proom };
        let sql = "insert into player set ?"
        return mysql.db.query(sql, data, (err, result) => {
            if (err) throw err
        })
    },
    deletePlayer: function (pid) {
        let sql = `delete from player where pid = '${pid}'`
        return mysql.db.query(sql, (err, result) => {
            if (err) throw err
        })
    },
    getPlayersInRoom: function (proom, membersArray, membersName, rndfn, plbtns, plbtnh) {
        let sql = `select pname from player where proom = '${proom}'`
        mysql.db.query(sql, (err, result) => {
            membersArray = [];
            membersName = [];
            if (err) throw err
            membersArray = [...result]
            for (let i = 0; i < membersArray.length; i++) {
                membersName.push(membersArray[i].pname)
            }
            rndfn(membersName);
            if (membersArray.length > 4) {
                plbtns();
            }
            else if (membersArray.length < 5) {
                plbtnh();
            }
        })
    }
}

module.exports = Player;