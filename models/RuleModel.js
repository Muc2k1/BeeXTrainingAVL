const mysql = require('./DbConnection');

let Rule = {
    getMPM: function (round, nop, callback) {
        let rstring = "";
        let sql = `select mpm from rule where members = "${nop}"`
        mysql.db.query(sql, (err, result) => {
            if (err) throw err
            rstring = result[0].mpm
            rstring.split("")
            callback(rstring[round - 1])
        })
    }
}
module.exports = Rule;