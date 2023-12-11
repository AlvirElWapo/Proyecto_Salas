const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

let estadoCompartido = {
  state: [],
};

let ponenciasFinalizadas = {
  completadas : [],
  inconclusas : [],
}

const moderadoresConectados = [];

app.use(cors());
app.use(bodyParser.json());

app.get('/estado', (req, res) => {
  res.json(estadoCompartido);
});

app.get('/id_moderadores_conectados', (req, res) => {
  res.json(moderadoresConectados);
});


app.post('/moderador_activo', (req, res) => {
  const { ID_MOD } = req.body;
  console.log(`ID_MOD recibido: ${ID_MOD}`);
  // Check if ID_MOD already exists in the array
  const isAlreadyConnected = moderadoresConectados.some((mod) => mod.ID_Mod === ID_MOD);
  if (!isAlreadyConnected) {
    // If it doesn't exist, push it to the array
    moderadoresConectados.push({ ID_Mod: ID_MOD });
    console.log('Moderadores conectados:', moderadoresConectados);
  }else
  {
    console.log(`USUARIO ${ID_MOD} Re-Inició Sesión, nada por hacer...`)
  }
  res.status(200).send('ID_MOD recibido correctamente.');
});


app.get('/obtener_moderadores_activos', (req, res) => {
  console.log("-------------------------------------------------------------------------")
  console.log("MODERADORES ACTIVOS: " + `${moderadoresConectados}`);
  console.log("-------------------------------------------------------------------------")
  res.json(moderadoresConectados);
  const existeModerador = moderadoresConectados.some((moderador) => moderador.ID_Mod === ID_MOD);

  if (!existeModerador) {
    // Almacena el ID_MOD en la variable global si no existe.
    moderadoresConectados.push({ ID_Mod: ID_MOD, Estado: 'Conectado' });
    // Muestra la lista de moderadores conectados en la consola del servidor.
    console.log('Moderadores conectados:', moderadoresConectados);
    // Responde con un mensaje para indicar que se recibió el ID_MOD.
    res.status(200).send('ID_MOD recibido correctamente.');
  } else {
    console.log('El moderador ya está conectado:', ID_MOD);
    // Responde con un mensaje para indicar que el moderador ya está conectado.
    res.status(200).send('El moderador ya está conectado.');
  }
});

app.post('/activar_Sala', (req, res) => {
  const { ID_tra } = req.body;
  console.log("Activando PONENCIA", ID_tra);

  const isInCompletadas = ponenciasFinalizadas.completadas.includes(ID_tra);
  const isInInconclusas = ponenciasFinalizadas.inconclusas.includes(ID_tra);

  if (!isInCompletadas && !isInInconclusas) {
    const isDuplicate = estadoCompartido.state.includes(ID_tra);

    if (!isDuplicate) {
      estadoCompartido.state.push(ID_tra);
      res.json(estadoCompartido);
    } else {
      console.log("NO SE PUEDE INICIAR LA MISMA SESION 2 VECES, ERROR DE SERVIDOR");
      res.status(400).json({ error: "LA SESION YA FUE INICIADA" });
    }
  } else {
    console.log("ID_tra YA SE ENCUENTRA REGISTRADO! TRAMPOS@..");
    res.status(400).json({ error: "NO SE PUEDE RESUMIR UNA SESION CUANDO ESTE FUE CANCELADO, ESTE INCIDENTE TENDRA CONSECUENCIAS." });
  }
});

app.post('/desactivar_Sala', (req, res) => {
  const { ID_tra } = req.body;
  const areaIndex = estadoCompartido.state.indexOf(ID_tra);
  console.log(areaIndex);
  if (areaIndex !== -1) {
    estadoCompartido.state.splice(areaIndex, 1);
    console.log("PONENCIA ", ID_tra, "FINALIZADA");
  }
  res.json(estadoCompartido);
});


app.post('/concluir_Ponencia', (req, res) => {
  const { ID_tra } = req.body;
  console.log("Ponencia Concluida: ", ID_tra);

  const isInCompletadas = ponenciasFinalizadas.completadas.includes(ID_tra);
  const isInInconclusas = ponenciasFinalizadas.inconclusas.includes(ID_tra);

  if (!isInCompletadas && !isInInconclusas) {
    const isDuplicate = ponenciasFinalizadas.completadas.includes(ID_tra);

    if (!isDuplicate) {
      ponenciasFinalizadas.completadas.push(ID_tra);
      res.json(ponenciasFinalizadas);
    } else {
      console.log(ID_tra," YA FUE CONCLUIDA.");
      res.status(400).json({ error: "ID_tra YA FUE CONCLUIDA." });
    }
  } else {
      console.log(ID_tra," YA FUE CONCLUIDA.");
      res.status(400).json({ error: "ID_tra YA FUE CONCLUIDA." });
  }
});

app.post('/Ponencia_inconclusa', (req, res) => {
  const { ID_tra } = req.body;
  console.log("PONENCIA CANCELADA: ", ID_tra);

  const isInCompletadas = ponenciasFinalizadas.completadas.includes(ID_tra);
  const isInInconclusas = ponenciasFinalizadas.inconclusas.includes(ID_tra);

  if (!isInCompletadas && !isInInconclusas) {
    const isDuplicate = ponenciasFinalizadas.inconclusas.includes(ID_tra);

    if (!isDuplicate) {
      ponenciasFinalizadas.inconclusas.push(ID_tra);
      res.json(ponenciasFinalizadas);
    } else {
      console.log(ID_tra," YA FUE CONCLUIDA.");
      res.status(400).json({ error: "ID_tra YA FUE CONCLUIDA." });
    }
  } else {
    console.log(ID_tra," TRAMPA INCONCLUSA.");
    res.status(400).json({ error: "NO SE PUEDE RESUMIR UNA SESION CUANDO ESTE FUE CANCELADO, ESTE INCIDENTE TENDRA CONSECUENCIAS." });
  }
});

app.get('/salas_concluidas', (req, res) => {
  res.json(ponenciasFinalizadas);
});

module.exports = app;
