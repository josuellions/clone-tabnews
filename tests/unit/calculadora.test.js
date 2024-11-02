/* eslint-disable no-unused-vars */
/* eslint-env jest */

const calculadora = require("../../models/calculadora.js");

function callbackFunction() {
  console.log("Calculadora funcionando");
}

test("Teste Calculadora", callbackFunction);

test("espera que 1 seja 1", () => {
  expect(1).toBe(1);
});

//Teste Calculadora Somar
test("Somar 2 + 2 deve retornar 4", () => {
  const resultado = calculadora.somar(2, 2);
  expect(resultado).toBe(4);
});

test("Somar 5 + 100 deve retornar 105", () => {
  const resultado = calculadora.somar(5, 100);
  expect(resultado).toBe(105);
});

test("Somar 'banana' + 100 deve retornar 'Erro'", () => {
  const resultado = calculadora.somar("banana", 100);
  expect(resultado).toBe("Erro");
});

test("Somar 5 + 'banana' deve retornar 'Erro'", () => {
  const resultado = calculadora.somar(5, "banana");
  expect(resultado).toBe("Erro");
});

test("Somar vazio + 5 deve retornar 'Erro'", () => {
  const resultado = calculadora.somar("", 5);
  expect(resultado).toBe("Erro");
});

test("Somar 100 + vazio retornar 'Erro'", () => {
  const resultado = calculadora.somar(100, "");
  expect(resultado).toBe("Erro");
});

//Teste Calculadora Dividir
test("Dividir 2 por 2 retorna 1", () => {
  const resultado = calculadora.dividir(2, 2);
  expect(resultado).toBe(1);
});

test("Dividir 0 por 0 deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir(0, 0);

  expect(resultado).toBe(
    "Erro: valor do primeiro número deve ser maior que 0 (ZERO)",
  );
});

test("Dividir 0 por 5 deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir(0, 5);
  expect(resultado).toBe(0);
});

test("Dividir 15 por 0 deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir(15, 0);
  expect(resultado).toBe(
    "Erro: valor do segundo número deve ser maior que 0 (ZERO)",
  );
});

test("Dividir 'banana' por 100 deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir("banana", 100);
  expect(resultado).toBe("Erro: Somente valor númerico");
});

test("Dividir 5 por 'banana' deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir(5, "banana");
  expect(resultado).toBe("Erro: Somente valor númerico");
});

test("Dividir vazio por 5 deve retornar 'Erro'", () => {
  const resultado = calculadora.dividir("", 5);
  expect(resultado).toBe("Erro: Somente valor númerico");
});

test("Dividir 100 por vazio retornar 'Erro'", () => {
  const resultado = calculadora.dividir(100, "");
  expect(resultado).toBe("Erro: Somente valor númerico");
});
