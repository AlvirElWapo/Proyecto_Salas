const express = require('express');
const router = express.Router();

// Importa tu conexión a la base de datos, por ejemplo, db.query

// Ruta para agregar un moderador
router.post('/agregar-moderador', (req, res) => {
  const { nombre, email, celular } = req.body;

  // Ejecuta la consulta SQL para insertar el moderador en la base de datos
  const query = 'INSERT INTO MODERADORESEMERGENTES (Moderador, Correo, Celular) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, celular], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al guardar el moderador');
    } else {
      res.status(200).send('Moderador guardado exitosamente');
    }
  });
});

module.exports = router;
