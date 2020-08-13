var mysql      = require('../../node_modules/mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '401230',
    database : 'opentutorials'
  });
  db.connect();

  module.exports = db;