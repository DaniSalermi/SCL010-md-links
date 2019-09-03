// ! Dependencias necesarias del paquete
const fs = require("fs");
const readline = require("readline");
const FileHound = require("filehound");
const fetch = require("fetch");
const fetchUrl = fetch.fetchUrl;
const path = require("path");
const chalk = require("chalk");
// ! Fin dependencias necesarias del paquete

// Variable que contiene un arreglo con todos los tipos de archivos Markdown.
const ext = [
  "markdown",
  "mdown",
  "mkdn",
  "md",
  "mkd",
  "mdwn",
  "mdtxt",
  "mdtext",
  "text",
  "Rmd"
];

// ! Funciones compartidas (módulo y terminal)
//Función que valida si es un directorio o un archivo md
function checkMdFilesOrDirectory(path) {
  return ext.indexOf(path.split(".").pop());
}
//Función para retornar un directorio absoluto cuando una persona pasa un directorio relativo
function absoluteRoute(route) {
  if (path.isAbsolute(route)) {
    return route;
  } else {
    route = path.normalize(route);
    route = path.resolve(route);
    return route;
  }
}
//Función para obtener todos los archivos .md desde un directorio dado
function getFileFromDirectory(directory) {
  return FileHound.create()
    .paths(directory)
    .ext(ext)
    .depth(0)
    .find();
}
//Función validate, cuando se ejecuta, devuelve el status para cada link encontrado.
function validate(link) {
  return new Promise((resolve, reject) => {
    let status;
    fetchUrl(link, function(error, meta, body) {
      status = meta.status;
      resolve(status);
    });
  });
}
// Función que cuenta los links que está rotos (fail)
function brokenLinks(links) {
  let brokenLinksCounter = 0;
  links.forEach(link => {
    if (link.ok === "fail") {
      brokenLinksCounter++;
    }
  });
  return brokenLinksCounter;
}
//Función que retorna la cantidad de links que son únicos
function uniqueLinks(links) {
  let hrefs = [];
  links.forEach(link => {
    hrefs.push(link.href);
  });
  let uniqueLinks = [...new Set(hrefs)];
  return uniqueLinks.length;
}
//Función que obtiene el texto dentro de 2 corchetes (texto del link encontrado)
function getTextFromLine(line) {
  let text = line.split("[")[1];
  text = text.split("]")[0];
  const maxLengthOfText = 50;
  if (text.length > maxLengthOfText) {
    text = text.substring(0, maxLengthOfText);
  }
  return text;
}
//Función que obtiene el texto dentro de 2 parentesis que contienen el texto http (URL del link encontrado)
function getUrlFromLine(line) {
  let url = line.split("(http")[1];
  url = "http" + url;
  url = url.split(")")[0];
  return url;
}
//Esta función lee línea a línea un archivo markdown y devuelve un arreglo de objetos
async function processLineByLine(path, options) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let numberOfLine = 1;
  let numberOfLinks = 0;
  //Se inicializa el arreglo de links vacío
  let links = [];
  for await (const line of rl) {
    let linkInformation = {};
    if (line.includes("(http") && line.includes(")")) {
      let url = getUrlFromLine(line);

      //Se arma el objeto con la información de cada URL
      linkInformation = {
        href: url,
        text: getTextFromLine(line),
        file: path,
        line: numberOfLine
      };
      if (options.validate) {
        linkInformation.status = await validate(url);
        linkInformation.ok = linkInformation.status > 399 ? "fail" : "ok";
      }
      numberOfLinks++;
      links.push(linkInformation);
    }
    numberOfLine++;
  }
  if (options.stats) {
    let salida = "";
    salida += chalk.cyan(`Total: ${numberOfLinks} \n`);
    salida += chalk.green(`Unique: ${uniqueLinks(links)} \n`);
    if (options.validate) {
      salida += chalk.red(`Broken: ${brokenLinks(links)} \n`);
    }
    return salida;
  } else {
    return links;
  }
}
//Esta función se encarga de retornar los links cuando el path dado es un directorio
function getLinksWhenIsDirectory(arrayOfFiles, options) {
  return new Promise((resolve, reject) => {
    let arrayOfPromises = [];
    for (let i = 0; i < arrayOfFiles.length; i++) {
      arrayOfPromises.push(processLineByLine(arrayOfFiles[i], options));
    }
    return Promise.all(arrayOfPromises).then(listArrayMdLinks => {
      let output = [];
      listArrayMdLinks.forEach(listLinks => {
        if (options.stats) {
          output.push(listLinks);
        } else {
          listLinks.forEach(link => output.push(link));
        }
      });
      resolve(output);
    });
  });
}
// ! Fin funciones compartidas

// ! Módulo del require
module.exports = (path, options = { validate: false, stats: false }) => {
  return new Promise((resolve, reject) => {
    const isMd = checkMdFilesOrDirectory(path);
    if (isMd >= 0) {
      let userPath = absoluteRoute(path);
      resolve(processLineByLine(userPath, options));
    } else {
      let userPath = absoluteRoute(path);
      let listFile = getFileFromDirectory(userPath);
      listFile.then(files => {
        if (files.length > 0) {
          resolve(getLinksWhenIsDirectory(files, options));
        } else {
          reject("No hay archivos de tipo markdown");
        }
      });
    }
  });
};
module.exports.checkMdFilesOrDirectory = checkMdFilesOrDirectory;
module.exports.absoluteRoute = absoluteRoute;
module.exports.processLineByLine = processLineByLine;
module.exports.getFileFromDirectory = getFileFromDirectory;
module.exports.getLinksWhenIsDirectory = getLinksWhenIsDirectory;
module.exports.validate = validate;
// ! Fin módulo require
