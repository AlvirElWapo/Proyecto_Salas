const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '8.tcp.ngrok.io',
  user: 'root',
  password: '6327',
  database: 'SALAS_DB',
  port: 11168,
});

module.exports = pool;
