const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '8.tcp.ngrok.io',
  user: 'root',
  password: '6327',
  database: 'SALAS_DB',
  port: 11168,
});

<<<<<<< HEAD
module.exports = pool;
=======
module.exports = pool;
>>>>>>> 55140f31ab4207acf1cb739251cdf811544a1b61
