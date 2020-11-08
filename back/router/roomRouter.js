const router = require('express').Router();
const rooms = [];
const idNpwd = () => {
    const rand = (min, max) => Math.floor(Math.random() * (max - min +1)) + min;
    let id = rand(10000000000, 100000000000);
    let pwd = [];

    for (let i = 0; i < 6; i++) {
        pwd.push(String.fromCharCode([rand(65, 91), rand(97, 123), rand(48, 58)].sort(() => Math.random() - 0.5)[0]));
    }

    return {id:id, pwd:pwd.join``};
}

router.get('/create-room', (req, res) => {
    let newRoom = idNpwd();

    rooms.push(newRoom);
    res.json(newRoom);
});

router.get('/find-room', (req, res) => {
    let room = rooms.filter(v => v.id == req.query.id);
    let resData;

    if (room.length === 0) {
        resData = {err: 'Chambre inexistante'};
    } else {
        resData = room[0];
    }

    res.json(resData);
});

router.get('/test', (req, res) => {
    console.log('bien recu');
})

module.exports = [router, rooms];