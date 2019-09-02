const mdLinks = require("./md-links");
console.time("Con validate");
mdLinks("./", {
  validate: false,
  stats: true
})
  .then(res => {
    console.log(res);
    console.timeEnd("Con validate");
  })
  .catch(err => {
    console.log(err);
  });
