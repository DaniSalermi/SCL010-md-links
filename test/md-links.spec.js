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
  test(`Se espera que retorne todos los archivos con extensiones válidas para Markdown, dentro de un directorio`, () => {
    return mdLinks.getFileFromDirectory("./mdFiles").then(res => {
      expect(res).toContain(
        "mdFiles/README.md",
        "mdFiles/READMEALTERNO.md",
        "mdFiles/archivo.mkdn"
      );
    });
  });

  test(`Se espera que retorne 200 para https://www.google.com`, () => {
    return mdLinks.validate("https://www.google.com").then(res => {
      expect(res).toBe(200);
    });
  });
});
