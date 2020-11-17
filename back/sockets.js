const User = require('./models/userModel');
const Room = require('./models/roomModel');

module.exports = server => {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId, userPseudo) => {
            Room.find({id: roomId}, (error, array) => {
                if (error === null) {
                    const user = new User();

                    user.pseudo = userPseudo;
                    user.peerId = userId;
                    user.roomId = roomId;
                    user.socketId = socket.id;

                    user.save((error, doc) => {
                        if (error === null) {
                            User.find({roomId: roomId}, (error2, array) => {
                                if (error2 === null) {
                                    console.log(`Mr ${user.peerId} joined ${roomId}`);
                                    socket.join(roomId);
                                    socket.to(roomId).broadcast.emit('user-connected', userId, userPseudo);
                                    io.to(roomId).emit('total-users', array);
                                }
                            });
                        }
                    });

                }
            });
        });

        socket.on('send-msg', (roomId, msg, user) => {
            io.to(roomId).emit('new-msg', user, msg);
        });

        socket.on('disconnect', () => {
            User.findOneAndDelete({socketId: socket.id}, (error, doc) => {
                if (error === null && doc !== null) {
                    const user = doc;

                    socket.to(user.roomId).broadcast.emit('user-disconnected', user.peerId, user.pseudo);
                    console.log(`Mr ${user.peerId} leaved ${user.roomId}`);

                    User.find({roomId: user.roomId}, (error, array) => {
                        io.to(user.roomId).emit('total-users', array);
                        if (error === null && array.length === 0) {
                            Room.findOneAndDelete({id: user.roomId}, (error, doc) => {
                                console.log(error);
                                console.log(doc);
                            });
                        }
                    });
                } else {
                    console.log(error);
                }
            });
        });
    });

    return io;
}