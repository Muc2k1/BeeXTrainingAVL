const path = require('path')

class SiteController {
    //get - /Site
    index(req, res) {
        res.render(path.join(__dirname,"/../views/mainpage.ejs"))
    }
    showSite(req, res) {
        res.send("showSite");
    }
}

module.exports = new SiteController;