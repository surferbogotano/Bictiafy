const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cancionSchema = new Schema({
    album: String,
    artista: String,
    genero: String,
    nombreCancion: String,
    anioCancion: String,
    imagen: String,
    url: String
});

module.exports = mongoose.model('Cancion', cancionSchema);

