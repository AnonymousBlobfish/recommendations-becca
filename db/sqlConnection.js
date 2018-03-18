var mysql = require('mysql');

exports.connection = function() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test123',
    database: 'wegot'
  });

  return connection;
};
