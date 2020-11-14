const express = require('express');
const app = express();
const server = app.listen(3000);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true });
const cors = require('cors');
const roomRouter = require('./router/roomRouter')[0];
const rooms = require('./router/roomRouter')[1];
const io = require('./sockets')(server, rooms);

app.use(cors());
app.use('/peerjs', peerServer);
app.use(roomRouter);