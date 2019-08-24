const fs = require("fs");
const readline = require("readline");

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

function getUrlFromLine(line) {
  let url = line.split("(h")[1];
  url = "h" + url;
  url = url.split(")")[0];
  return url;
}
async function processLineByLine(path) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let numberOfLine = 1;
  let numberOfLink = 0;
  let links = [];
  for await (const line of rl) {
    let linkInformation = {};
    if (line.includes(")") && line.includes("(http")) {
      console.log(`${numberOfLine}: ${line}`);
      linkInformation = {
        href: getUrlFromLine(line)
      };

      numberOfLink++;
      links.push(linkInformation);
    }
    numberOfLine++;
  }
  console.log(`Hay un total de: ${numberOfLink} links`);
  return links;
}

module.exports = (path, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    const isMd = ext.indexOf(path.split(".").pop());
    if (isMd >= 0) {
      resolve(processLineByLine(path));
    } else {
      reject("No hay archivos de tipo markdown");
    }
  });
};
