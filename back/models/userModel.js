const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    pseudo: {
        type: String,
        required: true
    },
    peerId: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
