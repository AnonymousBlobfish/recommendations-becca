var mysql = require('mysql');

exports.connection = function() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test1234',
    database: 'wegot'
  });

  return connection;
};
