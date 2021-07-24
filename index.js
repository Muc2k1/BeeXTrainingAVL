const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', './views')

const route = require('./routes/index.route.js')

const server = require('http').Server(app);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const socketUser = require('./socket/socket')
//connect

socketUser.useSocket(server);
route(app);

app.use(express.static(path.join(__dirname, '/public')))

server.listen(9090)