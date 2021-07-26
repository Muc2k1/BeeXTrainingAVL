const siteRouter = require('./site.route.js');
const playRouter = require('./play.route.js');
const errorRouter = require('./error.route.js');

function route(app) {
    app.use("/play", playRouter);
    app.use("/error", errorRouter);
    app.use("/", siteRouter);
}
module.exports = route;