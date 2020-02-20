/* 
Este archivo va a contener la conexion de Node con nuestra BD Mongo a través de mongoose.
index.js conecta los archivos app con mongo en el puerto seleccionado.
*/

const mongoose = require('mongoose'); //Importamos mongoose para la conexion
const app = require('./app'); // el ./ se va a asegurar de buscarlo en la carpeta raiz. 
//con en const app vamos a importar la lógica de Express
const port = 4000; //Declaramos el puerto que deseamos

//Vamos a crear la lógica de la conexion con la BD
//el metodo connect recibe 2 parametros, 1: la ruta de la BD a enlazar 
//y 2: será una funcion que a su vez recibirá los parametros error y respuesta.
mongoose.connect('mongodb://localhost:27017/nombreBD', (err, res)=>{
    //            Database-----Server-------Nombre DB
    if(err){
        console.log(`El error es: ${err}`);
    } else {
        console.log('¡Conexión Exitosa!');
        app.listen(port, ()=>{
            console.log(`Puerto: ${port}`);
        });
    }
});