#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const FileHound = require("filehound");
const fetchUrl = require("fetch").fetchUrl;
const process = require("process");
const commander = require("commander");
const program = new commander.Command();
program.version("1.0.1").description("Stadistics about markdown files");

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

program.parse(process.argv);
function getFileFromDirectory(directory) {
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

function getUrlFromLine(line) {
  let url = line.split("(h")[1];
  url = "h" + url;
  url = url.split(")")[0];
  return url;
}

function getTextFromLine(line) {
  let text = line.split("[")[1];
  text = text.split("]")[0];
  const maxLengthOfText = 50;
  if (text.length > maxLengthOfText) {
    text = text.substring(0, maxLengthOfText);
  }
  return text;
}

function validate(link) {
  return new Promise((resolve, reject) => {
    let status;
    fetchUrl(link, function(error, meta, body) {
      status = meta.status;
      resolve(status);
    });
  });
}

async function processLineByLine(path, options) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let numberOfLine = 1;
  let numberOfLinks = 0;
  let links = [];
  for await (const line of rl) {
    let linkInformation = {};
    if (line.includes(")") && line.includes("(http")) {
      let url = getUrlFromLine(line);
      linkInformation = {
        href: url,
        text: getTextFromLine(line),
        file: path,
        line: numberOfLine
      };
      if (options.validate) {
        linkInformation.status = await validate(url);
      }

      numberOfLinks++;
      links.push(linkInformation);
    }
    numberOfLine++;
  }
  console.log(`Hay un total de: ${numberOfLinks} links`);
  return links;
}

module.exports = (path, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    const isMd = ext.indexOf(path.split(".").pop());
    if (isMd >= 0) {
      resolve(processLineByLine(path, options));
    } else {
      reject("No hay archivos de tipo markdown");
    }
  });
};

const cliEjecution = () => {
  getFileFromDirectory(program.args[0]);
};

cliEjecution();
