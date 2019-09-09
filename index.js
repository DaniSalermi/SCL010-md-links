const mdLinks = require("./md-links");
console.time("Con validate");
mdLinks("README.md", {
  validate: true,
  stats: false
})
  .then(res => {
    console.log(res);
    console.timeEnd("Con validate");
  })
  .catch(err => {
    console.log(err);
  });
