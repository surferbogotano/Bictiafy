/*
El modelo es la representacion en código de la estructura de nuestras tablas
(coleccion en Mongo) de nuestra BD.
Siempre debe haber Un modelo por cada tabla 1 : 1 modelo.
*/
const mongoose = require('mongoose'); //Importamos mongoose
const Schema = mongoose.Schema; //Creamos un objeto Schema para nuestra colección (tabla) en MongoDb

//Crearemos una instancia del objeto Schema, hacer referencia a un uso de un objeto, es decir una Instancia por eso UsuarioSchema
var UsuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    correo: String,
    contrasena: String,
    rol: String,
    imagen: String
});

//Exportar el Schema
//mongoose.model recibe dos parametros que son: primero el nombre de la coleccion y el segundo es la estructura de esa coleccion
module.exports = mongoose.model('Usuario', UsuarioSchema);
//los nombres de las colecciones se escriben en singular siempre 
//porque por defecto mongoose le coloca el plural. 'Usuario' -> Usuarios