const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbURI = "mongodb+srv://***************************************************";

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(response => {
    const server = app.listen(3000);
    const { ExpressPeerServer } = require('peer');
    const peerServer = ExpressPeerServer(server, { debug: true });
    const cors = require('cors');
    const roomRouter = require('./routers/roomRouter');
    const io = require('./sockets')(server);

    app.use(cors());
    app.use('/peerjs', peerServer);
    app.use(roomRouter);
}).catch(error => {
    console.log(error);
});

