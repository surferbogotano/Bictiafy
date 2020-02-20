const express = require('express');
const CancionControl = require('../control/cancionControl');
const multiparty = require('connect-multiparty');
const subirImgCancion = multiparty({uploadDir: './archivos/canciones/imgCanciones'});
const subirAudioCancion = multiparty({uploadDir: './archivos/canciones/audioCanciones'});

var api = express.Router();

// Ruta Crear Cancion
api.post('/cancion', CancionControl.crearCancion);
// Ruta Mostrar Canciones
api.get('/cancion', CancionControl.mostrarCanciones);
// Ruta Mostrar Cancion
api.get('/cancion/:id', CancionControl.mostrarCancion);
// Ruta Buscar Cancion por Nombre
api.get('/buscarCancionXNombre', CancionControl.buscarCancionXNombre);
// Ruta Buscar Canciones
api.get('/buscarCanciones/:llave&:valor', CancionControl.buscarCanciones);
// Ruta Actualizar Cancion
api.put('/actualizarCancion/:id', CancionControl.actualizarCancion);
// Ruta Eliminar Cancion
api.delete('/cancion/:id', CancionControl.eliminarCancion);
// Ruta Subir Imagen Cancion
api.put('/subir-imagen-cancion/:id', subirImgCancion, CancionControl.subirImg);
// Ruta Mostrar Imagen Cancion
api.get('/obtener-imagen-cancion/:imageFile', subirImgCancion, CancionControl.mostrarImagen);
// Ruta Subir Audio Cancion
api.put('/subir-audio-cancion/:id', subirAudioCancion, CancionControl.subirAudio);
// Escuchar Audio Cancion
api.get('/play-audio-cancion/:audioFile', subirAudioCancion, CancionControl.escucharCancion);

module.exports = api;
