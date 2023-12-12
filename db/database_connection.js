const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '2.tcp.ngrok.io',
  user: 'root',
  password: '6327',
  database: 'SALAS_DB',
  port: 11914,
});

module.exports = pool;

