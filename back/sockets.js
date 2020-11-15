module.exports = (server, rooms) => {
    const io = require('socket.io')(server);
    const allUsers = [];

    io.on('connection', socket => {

        socket.on('join-room', (roomId, userId, userPseudo) => {
            let requiredRoom = rooms.filter(v => v.id == roomId);


            if (requiredRoom.length !== 0) {
                allUsers.push([socket, roomId, userId, userPseudo]);
                socket.join(roomId);
                socket.to(roomId).broadcast.emit('user-connected', userId);
            }

            console.log(`Mr ${userId} joined ${roomId}`);

        });

        socket.on('disconnect', () => {
            let disconnectedUser = allUsers.filter(v => v[0] == socket)[0];

            if (disconnectedUser != undefined) {
                let roomId = disconnectedUser[1];
                let userId = disconnectedUser[2];
                let userPseudo = disconnectedUser[3];

                console.log(roomId, userId);
                socket.to(roomId).broadcast.emit('user-disconnected', userId, userPseudo);
                allUsers.splice(allUsers.indexOf(disconnectedUser), 1);
                if (allUsers.filter(v => v[1] == roomId).length === 0) {
                    let room = rooms.filter(v => v.id == roomId)[0];
                    rooms.splice(rooms.indexOf(room), 1);
                }

                console.log(`Mr ${userId} leaved ${roomId}`);
            }
        });

        socket.on('error', error => console.log(error));

    });

    return io;
}