const mdLinks = require("./md-links");
mdLinks("./README.md")
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

console.log("Última línea del archivo");
