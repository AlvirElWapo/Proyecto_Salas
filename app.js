// DEPENDENCIAS DE LIBRERÍAS
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db/database_connection');
const argon2 = require('argon2');
const login_routes = require ('./routes/rutas_login');
const dashboard_routes = require ('./routes/rutas_dashboards');
const sql_views_router = require ('./routes/views_sql');
const estados = require ('./routes/logica_salas_api');
const cors = require('cors');

//EXPRESS Y MIDDLEWARE
const app = express();
const port = 1234;
app.use(session({
  secret: 'ea05839e74e8836ad2e903208a28006c', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400000, 
  },
}));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DIRECTORIOS DE ARCHIVOS
app.set('views', __dirname + '/views');
app.set('js', __dirname + '/js');
app.use(express.static(path.join(__dirname, '/public/paginas')));
app.use(express.static(__dirname + '/public'));
app.set('routes', __dirname + '/routes');

app.use('/',login_routes);
app.use('/',dashboard_routes);
app.use('/',sql_views_router);
app.use('/',estados);



// SERVIDOR
app.listen(port, () => 
{
  console.log(`Server is running on port ${port}`);
});
