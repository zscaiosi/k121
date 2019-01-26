const mongoose = require('mongoose');
const {configs} = require('../configs/configs');

module.exports = function(){
    return mongoose.createConnection(configs().mongoUrl, {
        useNewUrlParser: true
    });
}