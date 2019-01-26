const fs = require('fs');
const path = require('path');

function configs(){
  let conf = fs.readFileSync(path.resolve(__dirname, '../../configs.txt'), {
    encoding: 'utf8',
    flag: 'r'
  });

  return JSON.parse(conf) ? JSON.parse(conf) : {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "",
    "db": "db_zsseguros_prod",
    "mailpsw": ""
    };
}

module.exports = {configs: configs};