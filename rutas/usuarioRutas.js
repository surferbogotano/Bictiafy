/*
Vamos a crear el manejo de rutas de express para nuestro API
Se encargará de manejar las rutas del lado backend
*/

const express = require('express');
const UsuarioControl = require('../control/usuarioControl'); //Importamos el controlador de las funciones. 
//UsuarioControl se define con Mayuscula inicial para diferenciarse de una variable porque es una Constante.
const multiparty = require('connect-multiparty'); //importamos el paquete connect-multiparty para poder subir cualquier tipo de archivos
const subirImgDirectorio = multiparty({uploadDir: './archivos/usuarios'}); //uploadDir es un metodo propio de multiparty 


var api = express.Router(); //Cargamos el manejador de rutas de Express

/*
Estos son denominados métodos HTTP y hacen parte de las características de una API
POST -> Agregar datos
GET -> Obtener datos
PUT -> Actualizar datos
DELETE -> Eliminar datos
*/


// Declaración de las rutas que darán paso a la ejecución de las funciones

// Ruta Registro de Usuario
api.post('/registro', UsuarioControl.crearUsuario);
// Ruta Login Usuario
// En el caso de un login o un inicio de sesión, utilizamos el método post en vez de get. Porque post agrega datos.
api.post('/loginUsuario', UsuarioControl.login);
// Ruta actualizar datos usuario
api.put('/actualizarUsuario/:id', UsuarioControl.actualizarUsuario);
// Ruta Subir Imagen
api.put('/subir-imagen-usuario/:id', subirImgDirectorio, UsuarioControl.subirImg);
// Ruta Mostrar Archivo
api.get('/obtener-imagen-usuario/:imageFile', subirImgDirectorio, UsuarioControl.mostrarArchivo);


// Exportación del archivo usuarioRutas
module.exports = api;