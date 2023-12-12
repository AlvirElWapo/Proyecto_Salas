const express = require('express');
const db = require('../db/database_connection');
const { exec } = require('child_process');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


const app = express()


app.use(fileUpload());

app.use(express.json());  // Reemplaza bodyParser con express.json()
app.use(express.urlencoded({ extended: true }));

app.post('/ejecutar_ldmod', (req, res) => {
  const scriptPath = __dirname + '/../db/carga_bdd/ldmod.py';
  console.log(`Ejecutando script ldmod.py: ${scriptPath}`);

  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el script ldmod.py: ${error.message}`);
      res.status(500).json({ error: 'Error al ejecutar el script ldmod.py' });
      return;
    }
    if (stderr) {
      console.error(`Error al ejecutar el script ldmod.py: ${stderr}`);
      res.status(500).json({ error: 'Error al ejecutar el script ldmod.py' });
      return;
    }
    console.log(`Script ldmod.py ejecutado con éxito: ${stdout}`);
    res.json({ mensaje: 'Script ldmod.py ejecutado con éxito' });
  });
});

// Nueva ruta para subir archivo Moderadores
app.post('/subir_archivo_moderadores', (req, res) => {
  const file = req.files && req.files.archivo;
  if (file) {
    const directorioArchivos = path.join(__dirname, '../archivos_recibidos');
    
    // Crea el directorio si no existe
    if (!fs.existsSync(directorioArchivos)){
      fs.mkdirSync(directorioArchivos);
    }

    const filePath = path.join(directorioArchivos, 'moderadores.xlsx');
    file.mv(filePath, (error) => {
      if (error) {
        console.error(`Error al guardar el archivo Moderadores: ${error.message}`);
        res.status(500).json({ error: 'Error al guardar el archivo Moderadores' });
      } else {
        // Ejecuta el script ldmod.py con la ruta del archivo recién subido
        const scriptPath = path.join(__dirname, '../db/carga_bdd/ldmod.py');
        console.log(`Ejecutando script ldmod.py: ${scriptPath} ${filePath}`);

        exec(`python ${scriptPath} ${filePath}`, (scriptError, stdout, stderr) => {
          if (scriptError) {
            console.error(`Error al ejecutar el script ldmod.py: ${scriptError.message}`);
            res.status(500).json({ error: 'Error al ejecutar el script ldmod.py' });
            return;
          }
          if (stderr) {
            console.error(`Error al ejecutar el script ldmod.py: ${stderr}`);
            res.status(500).json({ error: 'Error al ejecutar el script ldmod.py' });
            return;
          }
          console.log(`Script ldmod.py ejecutado con éxito: ${stdout}`);

          // Ejecuta el script subir_sql_a_bd.py con la ruta del archivo SQL generado
          const subirSqlScriptPath = path.join(__dirname, '../db/carga_bdd/subir_sql_a_bd.py');
          const sqlFilePath = path.join(__dirname, '../Moderadores.sql');
          console.log(`Ejecutando script subir_sql_a_bd.py: ${subirSqlScriptPath} ${sqlFilePath}`);

          exec(`python ${subirSqlScriptPath} ${sqlFilePath}`, (sqlScriptError, sqlStdout, sqlStderr) => {
            if (sqlScriptError) {
              console.error(`Error al ejecutar el script subir_sql_a_bd.py: ${sqlScriptError.message}`);
              res.status(500).json({ error: 'Error al ejecutar el script subir_sql_a_bd.py' });
              return;
            }
            if (sqlStderr) {
              console.error(`Error al ejecutar el script subir_sql_a_bd.py: ${sqlStderr}`);
              res.status(500).json({ error: 'Error al ejecutar el script subir_sql_a_bd.py' });
              return;
            }
            console.log(`Script subir_sql_a_bd.py ejecutado con éxito: ${sqlStdout}`);
            res.json({ mensaje: 'Información cargada en la Base de Datos con éxito' });
          });
        });
      }
    });
  } else {
    res.status(400).json({ error: 'No se recibió ningún archivo Moderadores' });
  }
});

// Nueva ruta para subir archivo Moderadores
app.post('/subir_archivo_ponencias', (req, res) => {
  const file = req.files && req.files.archivo;
  if (file) {
    const directorioArchivos = path.join(__dirname, '../archivos_recibidos');
    
    // Crea el directorio si no existe
    if (!fs.existsSync(directorioArchivos)){
      fs.mkdirSync(directorioArchivos);
    }

    const filePath = path.join(directorioArchivos, 'ponencias.xlsx');
    file.mv(filePath, (error) => {
      if (error) {
        console.error(`Error al guardar el archivo ´Ponencias: ${error.message}`);
        res.status(500).json({ error: 'Error al guardar el archivo Ponencias' });
      } else {
        // Ejecuta el script ldmod.py con la ruta del archivo recién subido
        const scriptPath = path.join(__dirname, '../db/carga_bdd/load_data.py');
        console.log(`Ejecutando script load_data.py: ${scriptPath} ${filePath}`);

        exec(`python ${scriptPath} ${filePath}`, (scriptError, stdout, stderr) => {
          if (scriptError) {
            console.error(`Error al ejecutar el script load_data.py: ${scriptError.message}`);
            res.status(500).json({ error: 'Error al ejecutar el script load_data.py' });
            return;
          }
          if (stderr) {
            console.error(`Error al ejecutar el script load_data.py: ${stderr}`);
            res.status(500).json({ error: 'Error al ejecutar el script load_data.py' });
            return;
          }
          console.log(`Script load_data.py ejecutado con éxito: ${stdout}`);

          // Ejecuta el script subir_sql_a_bd.py con la ruta del archivo SQL generado
          const subirSqlScriptPath = path.join(__dirname, '../db/carga_bdd/subir_sql_a_bd.py');
          const sqlFilePath = path.join(__dirname, '../Ponencias.sql');
          console.log(`Ejecutando script subir_sql_a_bd.py: ${subirSqlScriptPath} ${sqlFilePath}`);

          exec(`python ${subirSqlScriptPath} ${sqlFilePath}`, (sqlScriptError, sqlStdout, sqlStderr) => {
            if (sqlScriptError) {
              console.error(`Error al ejecutar el script subir_sql_a_bd.py: ${sqlScriptError.message}`);
              res.status(500).json({ error: 'Error al ejecutar el script subir_sql_a_bd.py' });
              return;
            }
            if (sqlStderr) {
              console.error(`Error al ejecutar el script subir_sql_a_bd.py: ${sqlStderr}`);
              res.status(500).json({ error: 'Error al ejecutar el script subir_sql_a_bd.py' });
              return;
            }
            console.log(`Script subir_sql_a_bd.py ejecutado con éxito: ${sqlStdout}`);
            res.json({ mensaje: 'Información cargada en la Base de Datos con éxito' });
          });
        });
      }
    });
  } else {
    res.status(400).json({ error: 'No se recibió ningún archivo Ponencias' });
  }
});



// FUNCIONES SQL

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
        callback("No data available for the specified Id_Trab equposbyid");
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


const getModeradoresByEdificio= (edif, callback) => {
  console.log(edif);
  db.query(
    'SELECT * FROM MODERADORES m, PONENCIAS p  WHERE m.Sala = p.Identificador_Salon AND p.UBICACION = ? GROUP BY m.MODERADOR;',
    [edif],
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


const getModeradoresByEdificioEID = (edif, ID_Mod, callback) => {
  db.query(
    'SELECT m.* FROM MODERADORES m, PONENCIAS p WHERE m.Sala = p.Identificador_Salon AND p.UBICACION = ? AND m.ID_Mod = ? GROUP BY m.MODERADOR;',
    [edif, ID_Mod],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error", null);
      } else if (sqlRes.length > 0) {
        console.log(`DATOS ENCONTRADOS PARA EDIFICIO:${edif} ID_Mod: ${ID_Mod}`);
        callback(null, sqlRes);
      } else {
        console.log(`No data available for the specified EDIFICIO:${edif} ID_Mod: ${ID_Mod}`);
        callback("No data available", null);
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

const getTitulosPonenciasByModerador = (Investigador, callback) => {
  db.query(
    'SELECT Titulo FROM PONENCIAS WHERE Investigador= ?;',
    [Investigador],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No data available for the specified Investigador get titulos by invest");
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
        callback("No data available for the specified Id_Trab equiposbysalon");
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

const get_edificios= (callback) => 
{
  db.query(
    'SELECT UBICACION FROM PONENCIAS GROUP BY UBICACION' ,
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


const get_mod_by_Edificio = (callback) => 
{
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


const GET_TOTAL_PON = (callback) => {
  db.query(
    'SELECT COUNT(*) AS total FROM PONENCIAS',  // Utiliza AS total para darle un nombre al resultado
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes[0].total);  // Accede al total correctamente
      } else {
        callback("No data available in Ponencias ");
      }
    }
  );
};

const GET_TOTAL_MOD= (callback) => {
  db.query(
    'SELECT COUNT(*) AS total FROM MODERADORES',
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes[0].total); 
      } else {
        callback("No data available in Moderadores ");
      }
    }
  );
};


app.get('/total_ponencias', (req, res) => {
  GET_TOTAL_PON((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

app.get('/total_moderadores', (req, res) => {
  GET_TOTAL_MOD((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
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
  console.log("inf-equ "+Id_Trab)
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


app.post('/get_titulos', (req, res) => {
  const { Investigador } = req.body;
  getTitulosPonenciasByModerador(Investigador, (error, result) => 
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
  console.log("idtrabasis2122 "+Id_Trab);
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

app.get('/edificios', (req,res) => 
{
    get_edificios((error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(result);
      }
    });
  });


app.post('/informacion_por_edificio', (req, res) => {
  const { UBICACION } = req.body;
  console.log(UBICACION);
  getModeradoresByEdificio(UBICACION, (error, result) => 
  {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);

    }
  });
});


app.post('/informacion_por_edificio_eidemod', (req, res) => {
  const { UBICACION, ID_Mod } = req.body;
  getModeradoresByEdificioEID(UBICACION, ID_Mod, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});



const CREAR_EMERGENTE = (actualModerador, possibleModerador, callback) => {
  db.query(
    'SELECT SALA FROM MODERADORES WHERE MODERADOR = ?;',
    [actualModerador],
    (selectErr, selectRes) => {
      if (selectErr) {
        console.error(selectErr);
        callback("select_error");
      } else {
        const salaValue = selectRes[0].SALA;
        db.query(
          'UPDATE MODERADORES SET SALA = ? WHERE MODERADOR = ?;',
          [salaValue, possibleModerador.MODERADOR],
          (updateErr, updateRes) => {
            if (updateErr) {
              console.error(updateErr);
              callback("update_error");
            } else {
              db.query(
                'UPDATE MODERADORES SET SALA = NULL WHERE MODERADOR = ?;',
                [actualModerador],
                (nullUpdateErr, nullUpdateRes) => {
                  if (nullUpdateErr) {
                    console.error(nullUpdateErr);
                    callback("null_update_error");
                  } else {
                    callback(null, updateRes, nullUpdateRes);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};



const get_posibles_emergentes= (callback) => 
{
  db.query(
    'SELECT MODERADOR, ID_Mod FROM MODERADORES WHERE SALA IS NULL' ,
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

app.get('/posibles_emergentes', (req,res) => 
{
    get_posibles_emergentes((error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(result);
      }
    });
  });


app.post('/crear_emergente', (req, res) => {
  const { actualModerador, posibleModerador } = req.body;
  CREAR_EMERGENTE(actualModerador, posibleModerador, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error al realizar el cambio');
    } else {
      res.send('Cambio realizado con éxito');
    }
  });
  console.log(`CAMBIANDO ${actualModerador}, FOR ${posibleModerador.MODERADOR}`);
});


module.exports = app;
