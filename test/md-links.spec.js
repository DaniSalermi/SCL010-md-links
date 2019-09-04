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
  let arrayOfExample = [
    {
      href: "https://es.wikipedia.org/wiki/Markdown/fshgrsgk",
      text: "Markdown",
      file:
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      line: 3,
      status: 404,
      ok: "fail"
    },
    {
      href: "https://nodejs.org/ahgfdkh",
      text: "Node.js",
      file:
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      line: 14,
      status: 404,
      ok: "fail"
    },
    {
      href:
        "https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg",
      text: "md-links",
      file:
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      line: 18,
      status: 200,
      ok: "ok"
    }
  ];
  test(`Se espera que retorne 2 para arrayOfExample`, () => {
    expect(mdLinks.brokenLinks(arrayOfExample)).toBe(2);
  });
});
