const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
