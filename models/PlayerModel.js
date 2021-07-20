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
    getPlayersInRoom: function (proom, membersName, rndfn, plbtns, plbtnh) {
        let sql = `select pname from player where proom = '${proom}'`
        mysql.db.query(sql, (err, result) => {
            membersName = [];
            if (err) throw err
            for (let i = 0; i < result.length; i++) {
                membersName.push(result[i].pname)
            }
            rndfn(membersName);
            if (result.length > 4) {
                plbtns();
            }
            else if (result.length < 5) {
                plbtnh();
            }
        })
    },
    getIdsInRoom: function (proom, rndfn) {
        let sql = `select pid, pname from player where proom = '${proom}'`
        mysql.db.query(sql, (err, result) => {
            let membersName = [];
            let membersId = [];
            if (err) throw err
            for (let i = 0; i < result.length; i++) {
                membersId.push(result[i].pid)
                membersName.push(result[i].pname)
            }
            rndfn(membersId,membersName);
        })
    }
}

module.exports = Player;