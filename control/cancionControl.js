const Cancion = require("../modelo/cancion");
const fs = require("fs");
const path = require("path");

// Crear Cancion
function crearCancion(req, res) {
  var cancion = new Cancion();

  var parametros = req.body;

  // var album = cancion.album.toLowerCase()
  // para pulir la DB y estandarizar los datos en minusculas en la DB

  cancion.album = parametros.album;
  cancion.artista = parametros.artista;
  cancion.nombreCancion = parametros.nombreCancion;
  cancion.anioCancion = parametros.anioCancion;
  cancion.imagen = null;
  cancion.url = null;

  cancion.save((err, cancionNuevo) => {
    if (err) {
      res.status(500).send({ message: "error en el servidor" });
    } else {
      if (!cancionNuevo) {
        res.status(200).send({
          message: "No fue posible crear la cancion"
        });
      } else {
        res.status(200).send({ cancion: cancionNuevo });
      }
    }
  });
}

// Mostrar Cancion
function mostrarCancion(req, res) {
  var cancionId = req.params.id;

  Cancion.findById(cancionId, (err, cancionSi) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!cancionSi) {
        res.status(200).send({ message: "No fue posible mostrar la canción" });
      } else {
        res.status(200).send({ Cancion: cancionSi });
      }
    }
  });
}

// Buscar Cancion por Nombre
function buscarCancionXNombre(req, res) {
  var parametros = req.body;
  var buscarNombreCancion = parametros.nombreCancion;

  Cancion.findOne(
    { nombreCancion: buscarNombreCancion },
    (err, cancionEncontrada) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor!" });
      } else {
        if (!cancionEncontrada) {
          res
            .status(200)
            .send({ message: "Canción no se encontró, intente de nuevo" });
        } else {
          res.status(200).send({ cancion: cancionEncontrada });
          console.log("Match Exitoso, Cancion Encontrada");
        }
      }
    }
  );
}

// Buscar Canciones
function buscarCanciones(req, res) {
  var llave = req.params.llave;
  var valor = req.params.valor;
  // var valorN = valor.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
  // console.log(valorN);

  function sinAcento(cad) {
    cad = cad
      .replace(/a/gi, "[a,á]")
      .replace(/e/gi, "[e,é]")
      .replace(/i/gi, "[i,í]")
      .replace(/o/gi, "[o,ó]")
      .replace(/u/gi, "[u,ü,ú]");
    return cad;
  }
  switch (llave) {
    case "album":
      var busqueda = { album: { $regex: sinAcento(valor), $options: "i" } };
      break;
    case "artista":
      var busqueda = { artista: { $regex: sinAcento(valor), $options: "i" } };
      break;
    case "anioCancion":
      var busqueda = { anio: { $regex: sinAcento(valor), $options: "i" } };
      break;
    case "nombre":
    default:
      var busqueda = { nombre: { $regex: sinAcento(valor), $options: "i" } };
  }

  Cancion.find(busqueda, "_id nombre artista", (err, resultado) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (resultado.length == 0) {
        res.status(200).send({ message: "No fue posible encontrar alguna canción" });
      } else {
        res.status(200).send({ Resultado: resultado });
      }
    }
  });
}

// Mostrar todas las Canciones
function mostrarCanciones(req, res) {
  Cancion.find({}, (err, canciones) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!canciones) {
        res
          .status(200)
          .send({ message: "No fue posible mostrar las canciones." });
      } else {
        res.status(200).send({ Cancion: canciones });
        console.log("Match Exitoso, Canciones Encontradas");
      }
    }
  });
}

// Actualizar Cancion
function actualizarCancion(req, res) {
  var cancionId = req.params.id;
  var nuevosDatosCancion = req.body;

  Cancion.findByIdAndUpdate(
    cancionId,
    nuevosDatosCancion,
    (err, cancionActualizado) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        if (!cancionActualizado) {
          res
            .status(200)
            .send({ message: "No fue posible actualizar la canción" });
        } else {
          res.status(200).send({ cancion: cancionActualizado });
        }
      }
    }
  );
}

// Eliminar Cancion
function eliminarCancion(req,res){
  var cancionId = req.params.id;

  Cancion.findByIdAndDelete({_id:cancionId}, (err, cancionDelete)=>{
      if(err){
          res.status(500).send({message:"Error en el servidor"});
      }
      else{
          if(!cancionDelete){
              res.status(200).send({message:"No fue posible eliminar la canción"});
          }
          else{
              res.status(200).send({Cancion: cancionDelete});
          }
      }
  });
}

//Subir IMG Canciones
function subirImg(req, res) {
  var cancionId = req.params.id;
  var nombreArchivo = "No ha subido ninguna imagen...";

  //validar si efectivamente se está enviando o recibiendo la imagen
  if (req.files) {
    //vamos a ir analizando la ruta del archivo, el nombre y la extension.
    var rutaArchivo = req.files.imagen.path; //reconocer como archivo con el .file
    console.log(rutaArchivo);

    var partirArchivo = rutaArchivo.split("\\"); //en Linux la sintaxis de la maquina interpreta la separacion con el backslash '\' y para nosotros se ve con slash '/'
    // partir la cadena de la direccion de la imagen para guardar solo el nombre de la imagen.extension
    console.log(partirArchivo);

    var nombreArchivo = partirArchivo[3]; //guardamos la ultima posicion del arreglo que se crea con el split
    // en este momento se reescribe la variable con la imagen guardada.

    var extensionImg = nombreArchivo.split(".");
    //se hace con '\.' por precaucion de limpiar basura informatica y asegurar me separa la extension en el arreglo

    var extensionArchivo = extensionImg[1];
    console.log(extensionArchivo);

    //validar si el formato del archivo es aceptable
    if (
      extensionArchivo == "png" ||
      extensionArchivo == "jpg" ||
      extensionArchivo == "jpeg"
    ) {
      //actualizacion del usuario, del campo imagen que inicialmente teníamos null
      Cancion.findByIdAndUpdate(
        cancionId,
        { imagen: nombreArchivo },
        (err, cancionConImg) => {
          if (err) {
            res.status(500).send({ message: "Error en el servidor" });
          } else {
            if (!cancionConImg) {
              res
                .status(200)
                .send({ message: "No fue posible subir la imagen" });
              // con status 200 el usuario sigue en la vista actual y con el mensaje se le indica que no ha subido la img
            } else {
              res.status(200).send({
                imagen: nombreArchivo,
                cancion: cancionConImg
              });
            }
          }
        }
      );
    } else {
      //formato inválido
      res.status(200).send({ message: "Formato invalido. No es una imagen" });
      // Ej status 400 arroja pagina blanca y dentro del msj se puede colocar una imagen para indicar cual fue el error
    }
  } else {
    // No existe una img para subir
    res.status(200).send({ message: "No ha subido ninguna imagen" });
  }
}

//Mostrar Imagen Cancion
function mostrarImagen(req, res) {
  //pedir el archivo que queremos mostrar
  var archivo = req.params.imageFile;
  var ruta = "./archivos/canciones/imgCanciones/" + archivo;

  //validar si existe la imagen
  //el método fs.exists('el archivo a verificar', (existe o no en la carpeta)=>{})
  fs.exists(ruta, exists => {
    if (exists) {
      res.sendFile(path.resolve(ruta));
    } else {
      res.status(200).send({ message: "Imagen No encontrada" });
    }
  });
}

//Subir Canciones
function subirAudio(req, res) {
  var cancionId = req.params.id;
  var nombreArchivo = "No ha subido ninguna cancion...";

  //validar si efectivamente se está enviando o recibiendo la imagen
  if (req.files) {
    //vamos a ir analizando la ruta del archivo, el nombre y la extension.
    var rutaArchivo = req.files.url.path; //reconocer como archivo con el .file
    console.log(rutaArchivo);

    var partirArchivo = rutaArchivo.split("\\"); //en Linux la sintaxis de la maquina interpreta la separacion con el backslash '\' y para nosotros se ve con slash '/'
    // partir la cadena de la direccion de la imagen para guardar solo el nombre de la imagen.extension
    console.log(partirArchivo);

    var nombreArchivo = partirArchivo[3]; //guardamos la ultima posicion del arreglo que se crea con el split
    // en este momento se reescribe la variable con la imagen guardada.
    console.log(nombreArchivo);

    var extensionAudio = nombreArchivo.split(".");
    console.log(extensionAudio);
    //se hace con '\.' por precaucion de limpiar basura informatica y asegurar me separa la extension en el arreglo

    var extensionArchivo = extensionAudio[1];
    console.log(extensionArchivo);

    //validar si el formato del archivo es aceptable
    if (extensionArchivo == "mp3") {
      //actualizacion del usuario, del campo imagen que inicialmente teníamos null
      Cancion.findByIdAndUpdate(
        cancionId,
        { url: nombreArchivo },
        (err, cancionConAudio) => {
          if (err) {
            res.status(500).send({ message: "Error en el servidor" });
          } else {
            if (!cancionConAudio) {
              res
                .status(200)
                .send({ message: "No fue posible subir la cancion." });
              // con status 200 el usuario sigue en la vista actual y con el mensaje se le indica que no ha subido la img
            } else {
              res.status(200).send({
                url: nombreArchivo,
                cancion: cancionConAudio
              });
            }
          }
        }
      );
    } else {
      //formato inválido
      res.status(200).send({ message: "Formato invalido. No es una canción." });
      // Ej status 400 arroja pagina blanca y dentro del msj se puede colocar una imagen para indicar cual fue el error
    }
  } else {
    // No existe una img para subir
    res.status(200).send({ message: "No ha subido ninguna canción." });
  }
}

//Escuchar Canciones
function escucharCancion(req, res) {
  //pedir el archivo que queremos mostrar
  var archivo = req.params.audioFile;
  var ruta = "./archivos/canciones/audioCanciones/" + archivo;

  //validar si existe la imagen
  //el método fs.exists('el archivo a verificar', (existe o no en la carpeta)=>{})
  fs.exists(ruta, exists => {
    if (exists) {
      res.sendFile(path.resolve(ruta));
    } else {
      res.status(200).send({ message: "Imagen No encontrada" });
    }
  });
}

module.exports = {
  crearCancion,
  mostrarCancion,
  mostrarCanciones,
  buscarCancionXNombre,
  buscarCanciones,
  actualizarCancion,
  eliminarCancion,
  subirImg,
  mostrarImagen,
  subirAudio,
  escucharCancion
};
