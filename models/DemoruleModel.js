const mysql = require('./DbConnection')

let Demo = {
    getRuleString: function (members, callback) {
        let ruleStringArray = [];
        let sql = `select roleString from demorule where members = '${members}'`
        mysql.db.query(sql, (err, result) => {
            ruleStringArray = result[0].roleString.split("")
            for(let i = 0; i < ruleStringArray.length; i++) {
                if(ruleStringArray[i] == 1){
                    ruleStringArray[i] = "Mực tiên tri"
                }
                if(ruleStringArray[i] == 2){
                    ruleStringArray[i] = "Mực nô đùa"
                }
                if(ruleStringArray[i] == 3){
                    ruleStringArray[i] = "Mực gian tà"
                }
                if(ruleStringArray[i] == 4){
                    ruleStringArray[i] = "Mực the assassin"
                }
            }
            callback(ruleStringArray);
        })
    }
}

module.exports = Demo;