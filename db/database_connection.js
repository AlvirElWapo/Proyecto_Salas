const mysql = require('mysql2');

const pool = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'SALAS_DB',
    port: '3307'
  });


module.exports = pool;

