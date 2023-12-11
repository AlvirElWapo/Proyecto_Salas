const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'SALAS_DB2',
  port: 3307,
});

module.exports = pool;
