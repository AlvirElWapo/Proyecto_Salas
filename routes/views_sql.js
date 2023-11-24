const express = require('express');
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

const getModeradoresByID= (Id_Mod, callback) => {
  console.log(Id_Mod)
  db.query(
    'SELECT * FROM TABLA_MODERADORES WHERE ID_Mod =?',
    [Id_Mod],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available for the specified ID_MODERADOR");
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

const getTitulosByID = (Id_Trab, callback) => {
  db.query(
    'SELECT Titulo FROM PONENCIAS WHERE ID_Tra= ?;',
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
const Agregar_moderadorEmergente = (Moderador, Array_Moderador, callback) => {
  db.query(
    'UPDATE MODERADORESEMERGENTES SET Correo = ? WHERE ID_Tra = ?',
    'UPDATE MODERADORESEMERGENTES SET Celular = ? WHERE ID_Tra = ?',
    [JSON.stringify(Array_Moderador), Moderador],
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

const Actualizar_lista_asistencias_Moderadores= (Id_Mod, Asistio, callback) => {
  db.query(
    'UPDATE MODERADORES SET Asistencia = ? WHERE ID_Mod = ?',
    [Asistio, Id_Mod],
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

const GET_ID_MOD= (callback) => {
  db.query(
    'SELECT ID_Mod FROM MODERADORES',
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

app.get('/id_mods', (req, res) => {
  GET_ID_MOD((error, result) => {
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


app.post('/get_titulo', (req, res) => {
  const { Salon } = req.body;
  console.log(Salon);
  getTitulosByID(Salon, (error, result) => 
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

app.post('/asistencia_mods', (req, res) => {
  console.log("recieved asistencia request");
  const { ID_Mod, Asistencia } = req.body;
  Actualizar_lista_asistencias_Moderadores(ID_Mod, Asistencia, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Successfully updated asistencia array.' });
  });
});

app.post('/agregarmoderadore', (req, res) => {
  console.log("recieved moderadore request");
  const { Moderador, Asistencia } = req.body;
  Agregar_moderadorEmergente(Moderador, Correo, Celular, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Successfully updated moderadore array.' });
  });
});




app.post('/informacion_de_moderadores', (req, res) => {
  const { Id_Mod } = req.body;
  console.log(Id_Mod);
  getModeradoresByID(Id_Mod, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});






module.exports = app;
