const express = require('express');
const app = express();
const server = app.listen(3000);
const { ExpressPeerServer, PeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true });
const io = require('socket.io')(server);
const cors = require('cors');
const roomRouter = require('./router/roomRouter')[0];
const rooms = require('./router/roomRouter')[1];

app.use(cors());
app.use('/peerjs', peerServer);
app.use(roomRouter);

io.on('connection', socket => {
    socket.on('join-room', (room, user) => {
        let rroom = rooms.filter(v => v.id == room);

        if (rroom.length === 0) {
            //handle error
            console.log('room not found');
        } else {
            socket.join(room);
            socket.to(room).broadcast.emit('new-user', user);
            console.log('mr ' + user + ' has joined ' + room + ' room (log from server)');
            // console.log(io.sockets.adapter.rooms);
        }
    });
});