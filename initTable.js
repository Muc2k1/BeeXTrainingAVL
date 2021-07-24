
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'avalondb'
})

let dataCreateCount = 0;

let table = {
    initTable: function () {
        let sql1 = "CREATE TABLE demorule ( members INT NOT NULL , roleString VARCHAR(10) NOT NULL)"
        db.query(sql1, (err, result) => {
            if (err) throw err
            let sql11 = "INSERT INTO demorule (members, roleString) VALUES ('5', '12234'), ('6', '122234'), ('7', '1222334'), ('8', '12223334')"
            db.query(sql11, (err, result) => {
                if (err) throw err
                console.clear()
                dataCreateCount++;
                console.log("Data init: " + dataCreateCount + "/5");
                if (dataCreateCount == 5) {
                    console.log("Data init successly, you can press Ctrl + C to next step")
                }
                // console.log("demorule data was created")
            })
        })

        let sql2 = "CREATE TABLE player ( pid VARCHAR(20) NOT NULL , pname VARCHAR(30) NOT NULL , proom VARCHAR(20) NOT NULL , prole VARCHAR(30) NOT NULL , pvote TINYINT(1) NOT NULL )"
        db.query(sql2, (err, result) => {
            if (err) throw err
            console.clear()
            dataCreateCount++;
            console.log("Data init: " + dataCreateCount + "/5");
            if (dataCreateCount == 5) {
                console.log("Data init successly, you can press Ctrl + C to next step")
            }
        })
        let sql3 = "CREATE TABLE role ( rname VARCHAR(30) NOT NULL , rid VARCHAR(3) NOT NULL , rblueteam TINYINT(1) NOT NULL , rdes VARCHAR(200) NOT NULL )"
        db.query(sql3, (err, result) => {
            if (err) throw err
            let sql31 = "INSERT INTO role (rname, rid, rblueteam, rdes) VALUES ('Mực tiên tri', '2', '1', 'Thuộc phe Xanh,không hề có súng nhưng có thể nhận biết được phe Đỏ, cẩn thận thân phận bị bại lộ'), ('Mực nô đùa', '1', '1', 'Thuộc phe Xanh, cùng nhau làm nhiệm vụ và tìm ra kẻ gian thuộc phe Đỏ'), ('Mực the assassin', '4', '0', 'Thuộc phe Đỏ, trà trộn vào và phá hoại nhiệm vụ phe Xanh, tìm ra Mực Trần Thìn và thủ tiêu nếu phá hoại không thành công'), ('Mực gian tà', '3', '0', 'Thuộc phe Đỏ, trà trộn vào và phá hoại nhiệm vụ phe Xanh')"
            db.query(sql31, (err, result) => {
                if (err) throw err
                console.clear()
                dataCreateCount++;
                console.log("Data init: " + dataCreateCount + "/5");
                if (dataCreateCount == 5) {
                    console.log("Data init successly, you can press Ctrl + C to next step")
                }
            })
        })
        let sql4 = "CREATE TABLE rooms ( rname VARCHAR(20) NOT NULL , rresult VARCHAR(5) NULL DEFAULT NULL , rround INT(11) NOT NULL DEFAULT '1' , rmembers INT(11) NOT NULL , rhost VARCHAR(20) NOT NULL )"
        db.query(sql4, (err, result) => {
            if (err) throw err
            console.clear()
            dataCreateCount++;
            console.log("Data init: " + dataCreateCount + "/5");
            if (dataCreateCount == 5) {
                console.log("Data init successly, you can press Ctrl + C to next step")
            }
        })
        let sql5 = "CREATE TABLE rule ( members INT NOT NULL , round1 INT NOT NULL , round2 INT NOT NULL , round3 INT NOT NULL , round4 INT NOT NULL , round5 INT NOT NULL , blueteam INT NOT NULL , redteam INT NOT NULL , mpm VARCHAR(5) NOT NULL )"
        db.query(sql5, (err, result) => {
            if (err) throw err
            {
                let sql51 = "INSERT INTO rule (members, round1, round2, round3, round4,round5, blueteam,redteam,mpm) VALUES ('5', '2', '3', '2', '3', '3', '3', '2', '23233'), ('6', '2', '3', '4', '3', '4', '4', '2', '23434'), ('7', '2', '3', '3', '4', '4', '4', '3', '23344'), ('8', '3', '4', '4', '5', '5', '5', '3', '34455'), ('9', '3', '4', '4', '5', '5', '6', '3', '34455'), ('10', '3', '4', '4', '5', '5', '6', '4', '34455');"
                db.query(sql51, (err, result) => {
                    if (err) throw err
                    console.clear()
                    dataCreateCount++;
                    console.log("Data init: " + dataCreateCount + "/5");
                    if (dataCreateCount == 5) {
                        console.log("Data init successly, you can press Ctrl + C to next step")
                    }
                })
            }
        })
    }
}

module.exports = table;