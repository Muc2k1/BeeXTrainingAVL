const mysql = require('./DbConnection')

let Room = {
    checkRoom: function (rname, pid, callback) {
        let sql = `select rname from rooms where rname = '${rname}'`
        return mysql.db.query(sql, (err, result) => {
            if (err) throw err

            if (result[0]){
                Room.handleMember(rname, 1);
            }
            else{
                Room.addRoom(rname, null, 0, 1, pid);
            }
            Room.immaHost(rname,pid,callback)
        })
    },
    addRoom: function (rname, rresult, rround, rmembers, rhost) {
        let data = { rname: rname, rresult: rresult, rround: rround, rmembers: rmembers, rhost: rhost };
        let sql = "insert into rooms set ?"
        return mysql.db.query(sql, data, (err, result) => {
            if (err) throw err
        })
    },
    getMember: function (rname, callback) {
        let member = 0;
        let sql = `select rmembers from rooms where rname = "${rname}"`
        mysql.db.query(sql, (err, result) => {
            if (err) throw err
            member = result[0].rmembers;
            callback(member);
        })
    },
    handleMember: function (rname, addOrDelete){
        Room.getMember(rname, (members) => {
            let sql = `update rooms set rmembers = '${members + addOrDelete}' where rname = '${rname}'`
            mysql.db.query(sql, (err, result) => {
                if (err) throw err
                if(members + addOrDelete == 0)
                Room.deleteRoom(rname);
            })
        })
    },
    immaHost: function (rname, pid,callback){
        let sql = `select rhost from rooms where rname = "${rname}"`
        mysql.db.query(sql, (err, result) => {
            if (err) throw err
            if(pid == result[0].rhost) callback(); 
        })
    },
    deleteRoom: function (rname){
        let sql = `delete from rooms where rname = '${rname}'`
        mysql.db.query(sql, (err, result) => {
            if (err) throw err
        })
    }
}
module.exports = Room;