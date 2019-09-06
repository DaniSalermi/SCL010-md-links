// ! Terminal (CLI)
const mdLinks = require("./md-links");
const commander = require("commander");

const program = new commander.Command();
program.version("1.0.1").description("Stadistics about markdown files");

// Definiendo opciones válidas que podrá ingresar el usuario
program
  .option("-v, --validate", "to validate the links inside of a markdown file")
  .option(
    "-s, --stats",
    "to show some basic stats about the links (total of links and unique ones"
  );
// Fin de las opciones validas para nuestro paquete

program.parse(process.argv);

//Funcion que obtiene
function selectedOption() {
  let option = {};
  option.validate = program.validate;
  option.stats = program.stats;
  // console.log(option);
  return option;
}

const cliEjecution = () => {
  const isMd = mdLinks.checkMdFilesOrDirectory(program.args[0]);
  option = selectedOption();
  if (isMd >= 0) {
    let userPath;
    userPath = mdLinks.absoluteRoute(program.args[0]);
    mdLinks.processLineByLine(userPath, selectedOption()).then(printInTerminal);
  } else {
    userPath = mdLinks.absoluteRoute(program.args[0]);
    let listFile = mdLinks.getFileFromDirectory(userPath);
    listFile.then(files => {
      if (files.length > 0) {
        mdLinks.getLinksWhenIsDirectory(files, option).then(links => {
          if (option.stats) {
            links.forEach(stats => {
              console.log(stats);
            });
          } else {
            links.forEach(link => {
              console.log(`chalk${link.file}    ${link.href}    ${link.text}`);
            });
          }
        });
      } else {
        reject("No hay archivos de tipo markdown");
      }
    });
  }

  if (program.validate) {
  }
};
// Se determina si se está haciendo una ejecución por CLI
if (program.args.length > 0) {
  cliEjecution();
}

function printInTerminal(response) {
  if (program.stats) {
    console.log(response);
  } else {
    response.forEach(link => {
      console.log(
        `${link.file} ${link.href} ${
          program.validate ? link.ok + " " + link.status : ""
        } ${link.text} `
      );
    });
  }
}
// ! Fin funciones terminal (CLI)

module.exports.selectedOption = selectedOption;
module.exports.cliEjecution = cliEjecution;
module.exports.printInTerminal = printInTerminal;
