const siteRouter = require('./site.route.js');
const playRouter = require('./play.route.js');
function route(app) {
    app.use("/play", playRouter);
    app.use("/", siteRouter);
}
module.exports = route;