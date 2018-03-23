var mysql = require('mysql');

exports.pool = function() {
  var pool = mysql.createPool({
    connectionLimit: 100,
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'test1234',
    database: 'wegot'
  });

  return pool;
};
