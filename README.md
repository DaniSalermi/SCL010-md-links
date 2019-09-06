# Markdown Links

[![npm](https://img.shields.io/npm/v/@danisalermi/md-links)](https://www.npmjs.com/package/@danisalermi/md-links)
[![GitHub release - latest by date](https://img.shields.io/github/v/release/DaniSalermi/SCL010-md-links)](https://github.com/DaniSalermi/SCL010-md-links/releases)

Encuentra todos los links dentro de un archivo Markdown. Funciona cuando se ingresa una ruta relativa/ absoluta o si se llama un archivo Markdown que se encuentre en la posición relativa en la que está el usuario.

## Instalación 🔧

```console
$ npm install danisalermi/md-links
```

## Usage ⚙

```js
const md-links = require('@danisalermi/md-links');

danisalermi/md-links "path" <options>
```

## Opciones

Se puede utilizar el paquete con una serie de opciones.

## Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...), y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato `Markdown`, para verificar los links que contengan y reportar
algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## Dependencias 🔗

El paquete se desarrolló en _JavaScript_, haciendo uso de las siguientes dependencias fuera de node.js:

- Módulo [commander.js](https://github.com/tj/commander.js#options). Esta fue utilizada para agregar opciones al paquete de manera que usuario pudiera pasarlas de manera más amigable y tener una guía de lo que hace el programa `Utilizando danisalermi/md-links -help`
- Módulo [chalk](https://github.com/chalk/chalk). La misma se utilizò para colocar colores a las respuestas del paquete por consola.
  Ejemplo:
  <a href="https://ibb.co/gzKyZNk"><img src="https://i.ibb.co/syYj9n8/Estad-sticas-colores.png" alt="Estad-sticas-colores" border="0"></a>
- Módulo [filehound](https://www.npmjs.com/package/filehound), para poder encontrar todos los archivos con extensiones permitidas para archivos markdown dentro de un directorio.
- Módulo [fetch](https://www.npmjs.com/package/fetch). Para poder hacer las consultas al servidor http de los links encontrados.

Tambièn se hizo uso de las siguientes dependencias dentro de node.js:

- Módulo [process](https://nodejs.org/docs/latest/api/process.html#process_process_argv) con `process.argv[]`. Para obtener lo ingresado por el usuario mediante la terminal.
- Módulo [path](https://nodejs.org/api/path.html#path_path_isabsolute_path). Para poder normalizar una ruta y obtener posteriormente la ruta absoluta.
- Módulo [readline](https://nodejs.org/api/readline.html). Para leer cada línea de un archivo dado.
- Módulo [fs.createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options). Para leer un archivo desde un path ingresado por el usuario.
