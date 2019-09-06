const mdLinksTerminal = require("../md-links-terminal");
const commander = require("commander");
const program = new commander.Command();

program.parse(process.argv);
describe("mdLinksTerminal", () => {
  //Testeando función selectedOption
  test(`Se espera que retorne una opcion segun lo indicado por el usuario por consola`, () => {
    expect(mdLinksTerminal.selectedOption()).toStrictEqual({
      //Estoy usando undefined ya que no se como leer desde la console para los test.
      validate: undefined,
      stats: undefined
    });
  });
});
