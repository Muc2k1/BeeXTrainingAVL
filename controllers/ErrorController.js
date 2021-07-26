const path = require('path')

class ErrorController {
    index(req, res) {
        res.render(path.join(__dirname, "/../views/error.ejs"),{ vAlert: "Input is not valid" });
    }
}

module.exports = new ErrorController;