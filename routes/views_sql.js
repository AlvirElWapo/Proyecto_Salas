const express = require('express');
const path = require('path');
const db = require('../db/database_connection');

const app = express()


const getRingGraph = (callback) => {
  db.query(
    'SELECT * FROM Ring_Graph',
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available in Ring_Graph view");
      }
    }
  );
};

const GET_ID_TRA= (callback) => {
  db.query(
    'SELECT ID_Tra FROM PONENCIAS',
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available in ID_Tra view");
      }
    }
  );
};

const getRingGraph_dates = (callback) => {
  db.query(
    'SELECT * FROM RG_Fechas',
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available in Ring_Graph view");
      }
    }
  );
};

const getEquiposByTrabId = (Id_Trab, callback) => {
  db.query(
    'SELECT * FROM TABLA_USUARIOS WHERE ID_Tra = ?',
    [Id_Trab],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available for the specified Id_Trab");
      }
    }
  );
};


const getListaSedes = (callback) => {
  db.query(
    'SELECT Salon FROM PONENCIAS GROUP BY Salon;',
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available for Salon");
      }
    }
  );
};


const getEquiposBySalon = (Id_Trab, callback) => {
  db.query(
    'SELECT * FROM USUARIOS_POR_SALAS WHERE Salon = ?;',
    [Id_Trab],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available for the specified Id_Trab");
      }
    }
  );
};


const Actualizar_lista_asistencias = (Id_Trab, Array_Asistencias, callback) => {
  db.query(
    'UPDATE PONENCIAS SET Asistencia = ? WHERE ID_Tra = ?',
    [JSON.stringify(Array_Asistencias), Id_Trab],
    (updateErr, updateRes) => {
      if (updateErr) {
        console.error(updateErr);
        callback("update_error");
      } else {
        callback(null, updateRes);
      }
    }
  );
};

// Función para obtener los parámetros desde la base de datos
const obtenerParametros = async () => {
  try {
    const resultado = await pool.query('SELECT * FROM parametros');
    const parametros = {};
    
    // Convertir los resultados en un objeto de parámetros
    resultado.forEach(fila => {
      parametros[fila.nombre_parametro] = fila.valor_parametro;
    });

    return parametros;
  } catch (error) {
    console.error('Error al obtener parámetros:', error);
    throw error;
  }
};

// Ruta para obtener los parámetros
app.get('/parametros', async (req, res) => {
  try {
    const parametros = await obtenerParametros();
    res.json(parametros);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/areas', (req, res) => {
  getRingGraph((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});


app.get('/fechas', (req, res) => {
  getRingGraph_dates((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});


app.post('/informacion_de_equipos', (req, res) => {
  const { Id_Trab } = req.body;
  console.log(Id_Trab)
  getEquiposByTrabId(Id_Trab, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});


app.get('/id_tras', (req, res) => {
  GET_ID_TRA((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

app.get('/sedes', (req,res) => 
{
  getListaSedes((error, result) => {
    if (error) {
        console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
  });


app.post('/informacion_por_salones', (req, res) => {
  const { Salon } = req.body;
  console.log(Salon);
  getEquiposBySalon(Salon, (error, result) => 
  {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);

    }
  });
});

app.post('/asistencia', (req, res) => {
  console.log("recieved asistencia request");
  const { Id_Trab, Asistencia } = req.body;
  Actualizar_lista_asistencias(Id_Trab, Asistencia, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Successfully updated asistencia array.' });
  });
});



module.exports = app;
