const router = require('express').Router();
const roomController = require('../controllers/roomController');

router.get('/create-room', roomController.createRoom);
router.get('/find-room', roomController.findRoom);

module.exports = router;