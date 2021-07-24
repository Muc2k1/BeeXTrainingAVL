const { clearCache } = require('ejs');
const express = require('express');
const mysql = require('mysql');

const app = express();
const table = require("./initTable")
//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
})
function initApp() {
    let sql = "create database avalondb"
    db.query(sql, (err, result) => {
        if (err) throw err
        db.end(function(err) {
            if (err) {
              return console.log('error:' + err.message);
            }
            table.initTable();
          });
    })
}
initApp();

app.listen(3000);