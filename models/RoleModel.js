const mysql = require('./DbConnection')

let Role = {
    getRoleDescription: function (rname, callback) {
        let des = "";
        let sql = `select rdes from role where rname = "${rname}"`
        mysql.db.query(sql, (err, result) => {
            if (err) throw err
            des = result[0].rdes;
            callback(des);
        })
    },
}
module.exports = Role;