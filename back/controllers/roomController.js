const Room = require('../models/roomModel');

const idNpwd = () => {
    const rand = (min, max) => Math.floor(Math.random() * (max - min +1)) + min;
    let id = rand(10000000000, 100000000000);
    let pwd = [];

    for (let i = 0; i < 6; i++) {
        pwd.push(String.fromCharCode([rand(65, 91), rand(97, 123), rand(48, 58)].sort(() => Math.random() - 0.5)[0]));
    }

    return {id:id, pwd:pwd.join``};
}

exports.createRoom = (req, res) => {
    const room = new Room();
    let newRoom = idNpwd();

    room.id = newRoom.id;
    room.pwd = newRoom.pwd;
    room.save((error, doc) => {
        if (error === null) {
            res.json(newRoom);
            console.log(`New room created: {id: ${newRoom.id}, pwd: ${newRoom.pwd}}`);
        } else {
            res.json({err: 'erreur'});
        }
    });
};

exports.findRoom = (req, res) => {
    Room.find({id: req.query.id}, (error, array) => {
        if (error === null && array.length !== 0) {
            resData = {id: array[0].id, pwd: array[0].pwd};
        } else {
            resData = {err: 'Chambre inexistante'};
        }

        res.json(resData);
    });
};