const path = require('path')

class PlayController {
    index(req, res) {
        var specialChars = /[^a-zA-Z0-9 ]/g;
        if(req.body.name.length <= 30 && req.body.room.length <= 20 && req.body.name.length > 0 && req.body.room.length > 0 && !specialChars.test(req.body.name) && !specialChars.test(req.body.room))//req.body.name.match(specialChars) && req.body.room.match(specialChars) && 
           res.render(path.join(__dirname, "/../views/gamepage.ejs"),{ name: req.body.name, room: req.body.room });
        else
            res.render(path.join(__dirname, "/../views/error.ejs"),{ vAlert: "Input is not valid" });
    }
}

module.exports = new PlayController;