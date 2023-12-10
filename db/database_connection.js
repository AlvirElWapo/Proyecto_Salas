const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '172.17.0.2',
  user: 'root',
  database: 'SALAS_DB',
  password: '6327',
});

module.exports = pool;
