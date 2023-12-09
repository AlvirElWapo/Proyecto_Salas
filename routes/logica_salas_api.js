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


app.use(cors());
app.use(bodyParser.json());

app.get('/estado', (req, res) => {
  res.json(estadoCompartido);
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
