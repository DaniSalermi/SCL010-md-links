const mdLinks = require("../md-links");
const chalk = require("chalk");

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
  //Arreglo de ejemplo para testear las funciones: brokenLinks y uniqueLinks
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
  test(`Se espera que retorne 3 para arrayOfExample`, () => {
    expect(mdLinks.uniqueLinks(arrayOfExample)).toBe(3);
  });
  //Definiendo una línea para probar las funciones getTextFromLine
  let lineOfExample =
    "[motor de JavaScript V8 de Chrome](https://developers.google.com/v8/).";
  test(`Se espera que retorne "motor de JavaScript V8 de Chrome" para lineOfExample`, () => {
    expect(mdLinks.getTextFromLine(lineOfExample)).toBe(
      "motor de JavaScript V8 de Chrome"
    );
  });
  test(`Se espera que retorne "https://developers.google.com/v8/" para lineOfExample`, () => {
    expect(mdLinks.getUrlFromLine(lineOfExample)).toBe(
      "https://developers.google.com/v8/"
    );
  });
  //Testeando processLineByLine sin ninguna opción seleccionada
  test(`Se espera que retorne un arreglo de objetos con los siguientes datos: href, text y file, del archivo READMEALTERNO.md`, async () => {
    expect(
      await mdLinks.processLineByLine(
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        {
          validate: false,
          stats: false
        }
      )
    ).toStrictEqual([
      {
        href: "https://es.wikipedia.org/wiki/Markdown/fshgrsgk",
        text: "Markdown",
        file:
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        line: 3
      },
      {
        href: "https://nodejs.org/ahgfdkh",
        text: "Node.js",
        file:
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        line: 14
      },
      {
        href:
          "https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg",
        text: "md-links",
        file:
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        line: 18
      }
    ]);
  });
  //Testeando processLineByLine con Validate seleccionado
  test(`Se espera que retorne un arreglo de objetos con datos los siguientes datos: href, text, file, status y ok, del archivo READMEALTERNO.md`, async () => {
    expect(
      await mdLinks.processLineByLine(
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        {
          validate: true,
          stats: false
        }
      )
    ).toStrictEqual([
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
    ]);
  });
  //Testeando processLineByLine con Stats seleccionado
  test(`Se espera que retorne estadísticas con el total de links y cantidad de links únicos del archivo READMEALTERNO.md`, async () => {
    expect(
      await mdLinks.processLineByLine(
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        {
          validate: false,
          stats: true
        }
      )
    ).toBe(`${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}`);
  });
  //Testeando processLineByLine con Stats y Validate seleccionados
  test(`Se espera que retorne estadísticas con el total de links, cantidad de links únicos y cantidad de links rotos del archivo READMEALTERNO.md`, async () => {
    expect(
      await mdLinks.processLineByLine(
        "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
        {
          validate: true,
          stats: true
        }
      )
    ).toBe(
      `${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}${chalk.red(
        "Broken: 2\n"
      )}`
    );
  });
  //Testeando getLinksWhenIsDirectory sin opciones seleccionadas
  test(`Se espera que retorne un arreglo de objetos con los siguientes datos: href, text y file, de un arreglo de archivos`, () => {
    return mdLinks
      .getLinksWhenIsDirectory(
        [
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn"
        ],
        {
          validate: false,
          stats: false
        }
      )
      .then(res => {
        expect(res).toStrictEqual([
          {
            href: "https://es.wikipedia.org/wiki/Markdown/fshgrsgk",
            text: "Markdown",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
            line: 3
          },
          {
            href: "https://nodejs.org/ahgfdkh",
            text: "Node.js",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
            line: 14
          },
          {
            href:
              "https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg",
            text: "md-links",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
            line: 18
          },
          {
            href: "https://nodejs.org/en/",
            text: "Node.js",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn",
            line: 13
          },
          {
            href: "https://nodejs.org/docs/latest-v0.10.x/api/modules.html",
            text: "módulos (CommonJS)",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn",
            line: 14
          }
        ]);
      });
  });
  //Testeando getLinksWhenIsDirectory con opción validate seleccionada
  test(`Se espera que retorne un arreglo de objetos con datos los siguientes datos: href, text, file, status y ok, de un arreglo de archivos`, () => {
    return mdLinks
      .getLinksWhenIsDirectory(
        [
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn"
        ],
        {
          validate: true,
          stats: false
        }
      )
      .then(res => {
        expect(res).toStrictEqual([
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
          },
          {
            href: "https://nodejs.org/en/",
            text: "Node.js",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn",
            line: 13,
            status: 200,
            ok: "ok"
          },
          {
            href: "https://nodejs.org/docs/latest-v0.10.x/api/modules.html",
            text: "módulos (CommonJS)",
            file:
              "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn",
            line: 14,
            status: 200,
            ok: "ok"
          }
        ]);
      });
  });
  //Testeando getLinksWhenIsDirectory con opción stats seleccionada
  test(`Se espera que retorne un arreglo con estadísticas (Tota y Unique) para un arreglo de archivos`, () => {
    return mdLinks
      .getLinksWhenIsDirectory(
        [
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn"
        ],
        {
          validate: false,
          stats: true
        }
      )
      .then(res => {
        expect(res).toStrictEqual([
          `${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}`,
          `${chalk.cyan("Total: 2\n")}${chalk.green("Unique: 2\n")}`
        ]);
      });
  });
  //Testeando getLinksWhenIsDirectory con opción validate y stats seleccionadas
  test(`Se espera que retorne un arreglo con estadísticas (Total, Unique y Broken) para un arreglo de archivos`, () => {
    return mdLinks
      .getLinksWhenIsDirectory(
        [
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/Tester.mkdn"
        ],
        {
          validate: true,
          stats: true
        }
      )
      .then(res => {
        expect(res).toStrictEqual([
          `${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}${chalk.red(
            "Broken: 2\n"
          )}`,
          `${chalk.cyan("Total: 2\n")}${chalk.green("Unique: 2\n")}${chalk.red(
            "Broken: 0\n"
          )}`
        ]);
      });
  });
  //Testeando module.export sin opciones seleccionadas
  test(`Se espera que retorne un arreglo de objetos con los siguientes datos: href, text y file, del archivo READMEALTERNO.md`, () => {
    return mdLinks(
      "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      {
        validate: false,
        stats: false
      }
    ).then(res => {
      expect(res).toStrictEqual([
        {
          href: "https://es.wikipedia.org/wiki/Markdown/fshgrsgk",
          text: "Markdown",
          file:
            "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          line: 3
        },
        {
          href: "https://nodejs.org/ahgfdkh",
          text: "Node.js",
          file:
            "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          line: 14
        },
        {
          href:
            "https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg",
          text: "md-links",
          file:
            "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
          line: 18
        }
      ]);
    });
  });
  //Testeando module.export con opción validate
  test(`Se espera que retorne un arreglo de objetos con datos los siguientes datos: href, text, file, status y ok, del archivo READMEALTERNO.md`, () => {
    return mdLinks(
      "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      {
        validate: true,
        stats: false
      }
    ).then(res => {
      expect(res).toStrictEqual([
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
      ]);
    });
  });
  //Testeando module.export con opción stats
  test(`Se espera que retorne estadísticas con el total de links y cantidad de links únicos del archivo READMEALTERNO.md`, () => {
    return mdLinks(
      "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      {
        validate: false,
        stats: true
      }
    ).then(res => {
      expect(res).toBe(
        `${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}`
      );
    });
  });
  //Testeando module.export con opciones validate y stats
  test(`Se espera que retorne estadísticas con el total de links, cantidad de links únicos y cantidad de links rotos del archivo READMEALTERNO.md`, () => {
    return mdLinks(
      "/mnt/c/Users/saler/Documents/Programacion/SCL010-md-links/mdFiles/READMEALTERNO.md",
      {
        validate: true,
        stats: true
      }
    ).then(res => {
      expect(res).toBe(
        `${chalk.cyan("Total: 3\n")}${chalk.green("Unique: 3\n")}${chalk.red(
          "Broken: 2\n"
        )}`
      );
    });
  });
});
