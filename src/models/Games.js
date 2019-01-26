const mongoose = require('mongoose');
const conn = require('./DAO');

let GameSchema = mongoose.Schema({
    _id: Number,
    played: Boolean,
    playedDate: Date,
    subscribers: Array,
    pairs: Array,
    domain: String
});

module.exports = conn().model('Games', GameSchema);