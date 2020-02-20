/*
Va a contener toda la lógica de ruteo de express.
Declaraciones de rutas, uso del middleware body-parser.
Permisos de acceso a cualquier cliente (Permisos al aplicativo Front hecho en Angular)
*/

const express = require('express');
const bodyParser = require('body-parser'); //Permitir analizar datos en la URL

const app = express(); //Aplication express

//Solicitar las rutas de acceso a cada funcion que ejecutará nuestra app
const usuarioRutas = require('./rutas/usuarioRutas');
const cancionRutas = require('./rutas/cancionRutas');

//-- MIDDLEWARES --
//Declaramos el análisis de datos de body-parser
app.use(bodyParser.json()); //determinamos manejar solo formatos json

//Configuracion de permisos de acceso


//Consumo de las rutas
app.use('/api', usuarioRutas);
app.use('/api', cancionRutas);
// -- FIN MIDDLEWARES --

//Exportamos el archivo app.js para su uso en la aplicación o archivo raíz index.js
module.exports = app; 
//debe ser el mismo nombre del const app = require('./app') en index.js
