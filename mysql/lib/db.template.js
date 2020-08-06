

var mysql      = require('../../node_modules/mysql');
var db = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
  });
  db.connect();

  module.exports = db;