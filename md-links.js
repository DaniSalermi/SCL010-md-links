#!/usr/bin/env node
// ! Dependencias necesarias del paquete
const fs = require("fs");
const readline = require("readline");
const FileHound = require("filehound");
const fetchUrl = require("fetch").fetchUrl;
const commander = require("commander");

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

//Esta función lee línea a líne un archivo markdown y devuelve un arreglo de objetos
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
  console.log(`Hay un total de: ${numberOfLinks} links`);
  if (options.stats) {
    let salida = "";
    salida += `Total: ${numberOfLinks} \n`;
    salida += `Unique: ${uniqueLinks(links)} \n`;
    if (options.validate) {
      salida += `Broken: ${brokenLinks(links)} \n`;
    }
    return salida;
  } else {
    return links;
  }
}

function getFileFromDirectory(directory, options) {
  console.log(directory);
  const files = FileHound.create()
    .paths(directory)
    .ext(ext)
    .depth(0)
    .find();
  files
    .then(res => {
      res.forEach(markDownDocument => {
        processLineByLine(markDownDocument, { validate: false }).then(links => {
          links.forEach(link => {
            console.log(`${link.file} ${link.href} ${link.text}`);
          });
        });
      });
      return console.log(res);
    })
    .catch(err => console.log(err));
}

// ! Fin funciones compartidas

// ! Módulo del require
module.exports = (path, options = { validate: false, stats: false }) => {
  return new Promise((resolve, reject) => {
    console.log(path);
    const isMd = checkMdFilesOrDirectory(path);
    if (isMd >= 0) {
      resolve(processLineByLine(path, options));
    } else {
      resolve(getFileFromDirectory(path, options));
      //reject("No hay archivos de tipo markdown");
    }
  });
};

// ! Fin módulo require

// ! Terminal (CLI)

const program = new commander.Command();
program.version("1.0.1").description("Stadistics about markdown files");

//Definiendo opciones válidas que podrá ingresar el usuario
program
  .option("-v, --validate", "to validate the links inside of a markdown file")
  .option(
    "-s, --stats",
    "to show some basic stats about the links (total of links and unique ones"
  );

program.parse(process.argv);

console.log(program.args);

const cliEjecution = () => {
  const isMd = checkMdFilesOrDirectory(program.args[0]);
  if (isMd >= 0) {
    processLineByLine(program.args[0]);
  } else {
    getFileFromDirectory(program.args[0]);
  }

  if (program.validate) {
  }
};
// Se determina si se está haciendo una ejecución por CLI
if (program.args.length > 0) {
  cliEjecution();
}

// ! Fin funciones terminal (CLI)
