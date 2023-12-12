const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../db/database_connection');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let Salas_Activadas = {
  id_salas:[],
  Moderador:[],
  Ponencias: [],
};

let Salas_Autorizadas = {
  id_salas:[],
  Moderador:[],
  Ponencias: [],
};

let Salas_Concluidas = {
  id_salas:[],
  Moderador:[],
  Ponencias: [],
};


app.get('/get_salas', (req, res) => {
  const state = req.query.state; // 'activadas', 'autorizadas', or 'concluidas'

  switch (state) {
    case 'activadas':
      console.log("BUSCO ACTIVADAS: " + Salas_Activadas.Moderador)
      res.json(Salas_Activadas);
      break;
    case 'autorizadas':
      console.log("BUSCO AUTORIZADAS: " + Salas_Autorizadas.Moderador)
      res.json(Salas_Autorizadas);
      break;
    case 'concluidas':
      console.log("BUSCO FINALIZADAS: " + Salas_Concluidas.Moderador)
      res.json(Salas_Concluidas);
      break;
    default:
      res.status(400).send('Invalid state parameter');
  }
});


const getPonenciasPorSala = (Sala, callback) => {
  db.query(
    'SELECT * FROM PONENCIAS WHERE Identificador_Salon = ?',
    [Sala],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No hay datos disponibles para la Sala especificada");
      }
    }
  );
};


const getModeradorPorSala = (Sala, callback) => {
  db.query(
    'SELECT MODERADOR FROM MODERADORES WHERE Sala = ?',
    [Sala],
    (err, sqlRes) => {
      if (err) {
        console.error(err);
        callback("sql_error");
      } else if (sqlRes.length > 0) {
        callback(null, sqlRes);
      } else {
        callback("No hay datos disponibles para la Sala especificada");
      }
    }
  );
};




// Function to check if a Sala exists in a given state
const isSalaInState = (salaId, state) => {
  return state.id_salas.includes(salaId);
};

// Function to add Sala to a state
const addSalaToState = (salaId, state, res, successMessage) => {
  if (!state.id_salas.includes(salaId)) {
    getPonenciasPorSala(salaId, (err, ponencias) => {
      if (err) return res.status(500).send(err);

      // Remove duplicates by creating a Set and spreading the ponencias into it
      const uniquePonencias = new Set([...state.Ponencias, ...ponencias]);
      state.Ponencias = [...uniquePonencias];

      // Add salaId only if it's not already present
      if (!state.id_salas.includes(salaId)) {
        state.id_salas.push(salaId);
        res.json({ message: successMessage });
        
        // Only call getModeradorPorSala if salaId is not duplicated
        getModeradorPorSala(salaId, (err, moderadores) => {
          if (err) return res.status(500).send(err);

          // Remove duplicates in Moderador in a similar way
          const uniqueModeradores = new Set([...state.Moderador, ...moderadores]);
          state.Moderador = [...uniqueModeradores];
        });
      } else {
        // Send a neutral message when salaId is already present
        res.json({ message: "Sala already added." });
      }
    });
  } else {
    // Send a neutral message when salaId is already present
    res.json({ message: "Sala already added." });
  }
};

// Activate a Sala
app.post('/activar_s_global', (req, res) => {
  const { id_sala } = req.body;
  console.log("CHECAR ESTO*********************8" + id_sala);
  addSalaToState(id_sala, Salas_Activadas, res, 'Sala activada con éxito');
});

// Authorize a Sala
app.post('/autorizar_sala', (req, res) => {
  const { id_sala } = req.body;
  console.log("CHECAR ESTO*********************8" + id_sala);
  if (isSalaInState(id_sala, Salas_Activadas)) {
    addSalaToState(id_sala, Salas_Autorizadas, res, 'Sala autorizada con éxito');
  } else {
    res.status(400).send('Sala no está activada');
  }
});

// Conclude a Sala
app.post('/finalizar_sala', (req, res) => {
  const { id_sala } = req.body;

  if (isSalaInState(id_sala, Salas_Autorizadas)) {
    // Copy data from Salas_Autorizadas to Salas_Concluidas
    const index = Salas_Autorizadas.id_salas.indexOf(id_sala);
    if (index > -1) {
      Salas_Concluidas.id_salas.push(Salas_Autorizadas.id_salas[index]);
      Salas_Concluidas.Moderador.push(Salas_Autorizadas.Moderador[index]);
      Salas_Concluidas.Ponencias.push(Salas_Autorizadas.Ponencias[index]);

      res.json({ message: 'Sala concluida con éxito' });
    } else {
      res.status(400).send('Sala no encontrada en autorizadas');
    }
  } else {
    res.status(400).send('Sala no está autorizada');
  }
});


module.exports = app;


