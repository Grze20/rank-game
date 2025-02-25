const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    nick: {
        type : String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    }

});
const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;