const path = require('path')

class PlayController {
    index(req, res) {
        res.render(path.join(__dirname, "/../views/gamepage.ejs"),
        { name: req.body.name, room: req.body.room });
    }
}

module.exports = new PlayController;