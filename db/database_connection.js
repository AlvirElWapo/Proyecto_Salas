const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '172.17.0.2',
  user: 'root',
  password: '6327',
  database: 'SALAS_DB',
});

module.exports = pool;

