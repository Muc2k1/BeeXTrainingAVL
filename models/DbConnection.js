const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'avalondb'
})

function dbconnect(){
    db.connect((err) => {
        if (err) throw err
        console.log("MySql connected")
    })
}

module.exports = {db, dbconnect};