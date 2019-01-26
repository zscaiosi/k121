const mongoose = require('mongoose');
const conn = require('./DAO');

let UsersSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: { type: String, unique: true, validate: (val) => val.indexOf("@") > -1 && val.indexOf(".com") > -1 },
    password: { type: String },
    createDate: Date,
    role: Number,
    domainId: Number
});

module.exports = conn().model('Users', UsersSchema);