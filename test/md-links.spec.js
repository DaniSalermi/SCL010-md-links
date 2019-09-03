const mdLinks = require("../md-links");

describe("mdLinks", () => {
  test(`Se espera que retorne -1, para un directorio`, () => {
    expect(mdLinks.checkMdFilesOrDirectory("./")).toBe(-1);
  });
  test(`Se espera que retorne /mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles para ./mdfiles`, () => {
    expect(mdLinks.absoluteRoute("./mdFiles")).toBe(
      "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles"
    );
  });
});
