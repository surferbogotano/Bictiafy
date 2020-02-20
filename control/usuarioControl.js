/**
Se encargará de recibir los datos que el usuario envía desde la vista, procesandolos para
enviarlos al modelo y que este los pueda corroborar con la BD para posteriormente guardarlos.
Tambien tendrá toda la lógica de las consultas, actualizaciones y eliminaciones.
*/

const Usuario = require("../modelo/usuario"); //Importamos el modelo de usuario
const fs = require('fs'); // importamos el módulo File System de Node su tarea es leer archivos
const path = require('path'); // importamos el módulo Path de Node su tarea es donde se encuentran archivos

//Funcion Registro de Usuario
// req -> Peticion / Request
// res -> Respuesta / Response
function crearUsuario(req, res) {
  //instanciar el objeto Usuario
  var usuario = new Usuario();

  //Guardar el cuerpo de la peticion para tener acceso a los datos que el usuario está enviando
  // parametros = {"Nombre": "", "apellido": "", "correo": "", "contraseña": "", etc...}
  var parametros = req.body;

  //Guardamos cada propiedad del json de la peticion en cada propiedad del modelo
  usuario.nombre = parametros.nombre;
  usuario.apellido = parametros.apellido;
  usuario.correo = parametros.correo;
  usuario.contrasena = parametros.contrasena;
  usuario.rol = "usuario";
  usuario.imagen = null;

  //Guardar y validar los datos
  //db.coleccion.insert() como lo conocemos, .save() permite guardar datos en una BD de mongo
  usuario.save((err, usuarioNuevo) => {
    if (err) {
      // El primer error a validar será a nivel de servidor e infraestructura
      // Para esto existen states o estados.
      res.status(500).send({ message: "Error en el servidor" }); //500-599 errores posibles a nivel de servidores, el msj lo envia por el head a nivel de metadatos
    } else {
      if (!usuarioNuevo) {
        //404 -> Pagina No encontrada
        //200 -> OK pero con una alerta indicando que hay datos inválidos
        res.status(200).send({
          message: "No fue posible realizar el registro"
        });
      } else {
        //200 -> ok
        //se estarían enviando los datos, aun no se ha validado contraseña, ni el ingreso correcto de los datos, encriptado datos, solo se está enviando los datos.
        //Recomendado tener un archivo por cada cosa que necesite, por ejemplo un archivo solo de validaciones para poder llamar donde se necesite.
        res.status(200).send({ usuario: usuarioNuevo });
      }
    }
  });
}

//login usuario
function login(req, res) {
  var parametros = req.body;
  var correoUsuario = parametros.correo;
  var contrasenaUsuario = parametros.contrasena;

  // buscamos al usuario a través del correo. Usaremos toLowerCase() para evitar problemas de datos
  // con mayusculas, todo lo convertimos en minusculas.
  Usuario.findOne(
    { correo: correoUsuario.toLowerCase() }, (err, usuarioLogueado) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor!" });
      } else {
          //si no existe usuario logueado
        if (!usuarioLogueado) {
          /* otra opcion de decirlo seria: 
            if(!usuarioLogueado || usuarioLogueado.contrasena != contraUsuario){
                res.status(200).send({message: "No se ha iniciado sesión."});
            }
            */
          res.status(200).send({ message: "No se ha iniciado sesión. Verifica los datos." });
        } else {
          if (usuarioLogueado.contrasena != contrasenaUsuario) {
            res.status(200).send({ message: "contraseña incorrecta" });
          } else {
            res.status(200).send({ usuario: usuarioLogueado });
            console.log('Se ha iniciado sesión.');
          }
        }
      }
    });
}

//actualizar usuario
function actualizarUsuario(req, res){
    var usuarioId = req.params.id;
    var nuevosDatosUsuario = req.body;

    Usuario.findByIdAndUpdate(usuarioId, nuevosDatosUsuario, (err, usuarioActualizado)=>{
        if(err){
            res.status(500).send({message: "Error en el servidor"});
        } else{
            if(!usuarioActualizado){
                res.status(200).send({message: "No fue posible actualizar los datos"});
            } else{
                res.status(200).send({usuario: usuarioActualizado});
            }
        }
    });
}

//Subir IMG
function subirImg(req, res){
  var usuarioId = req.params.id;
  var nombreArchivo = "No ha subido ninguna imagen...";

  //validar si efectivamente se está enviando o recibiendo la imagen
  if(req.files){
    //vamos a ir analizando la ruta del archivo, el nombre y la extension.
    var rutaArchivo = req.files.imagen.path; //reconocer como archivo con el .file
    console.log(rutaArchivo);

    var partirArchivo = rutaArchivo.split('\\'); //en Linux la sintaxis de la maquina interpreta la separacion con el backslash '\' y para nosotros se ve con slash '/'
    // partir la cadena de la direccion de la imagen para guardar solo el nombre de la imagen.extension
    console.log(partirArchivo);

    var nombreArchivo = partirArchivo[2]; //guardamos la ultima posicion del arreglo que se crea con el split
    // en este momento se reescribe la variable con la imagen guardada.

    var extensionImg = nombreArchivo.split('\.') 
    //se hace con '\.' por precaucion de limpiar basura informatica y asegurar me separa la extension en el arreglo

    var extensionArchivo = extensionImg[1];
    console.log(extensionArchivo);

    //validar si el formato del archivo es aceptable
    if(extensionArchivo == "png" || extensionArchivo == "jpg" || extensionArchivo == "jpeg"){
      //actualizacion del usuario, del campo imagen que inicialmente teníamos null 
      Usuario.findByIdAndUpdate(usuarioId, {imagen: nombreArchivo}, (err, usuarioConImg)=>{
        if(err){
          res.status(500).send({message: "Error en el servidor"});
        } else{
          if(!usuarioConImg){
            res.status(200).send({message: "No fue posible subir la imagen"});
            // con status 200 el usuario sigue en la vista actual y con el mensaje se le indica que no ha subido la img
          } else{
            res.status(200).send({
              imagen: nombreArchivo,
              usuario: usuarioConImg
            });
          }
        }    
      });
    } else{
      //formato inválido
      res.status(200).send({message: "Formato invalido. No es una imagen"});
      // Ej status 400 arroja pagina blanca y dentro del msj se puede colocar una imagen para indicar cual fue el error
    }
  } else {
      // No existe una img para subir
      res.status(200).send({message: "No ha subido ninguna imagen"});
  }
}

//Mostrar Archivo
function mostrarArchivo(req, res){
  //pedir el archivo que queremos mostrar
  var archivo = req.params.imageFile;
  var ruta = './archivos/usuarios/' + archivo;

  //validar si existe la imagen
  //el método fs.exists('el archivo a verificar', (existe o no en la carpeta)=>{})
  fs.exists(ruta, (exists)=>{
    if(exists){
      res.sendFile(path.resolve(ruta));
    } else{
      res.status(200).send({message: "Imagen No encontrada"});
    }
  });
}

//Exportar las funciones creadas!!!
module.exports = {
  crearUsuario,
  login,
  actualizarUsuario,
  subirImg,
  mostrarArchivo
};
