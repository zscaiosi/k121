const mongoose = require('mongoose');
const conn = require('./DAO');

let DomainSchema = new mongoose.Schema({
    _id: String,
    domainName: String,
    createDate: Date,
    finishDate: Date,
    played: Boolean
});

module.exports = conn().model('Domains', DomainSchema);