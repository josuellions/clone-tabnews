function somar(numero1, numero2) {
  if (typeof numero1 !== "number" || typeof numero2 !== "number") {
    return "Erro";
  }

  if (String(numero1).length <= 0 || String(numero2).length <= 0) {
    return "Erro";
  }

  return numero1 + numero2;
}

function dividir(numero1, numero2) {
  if (typeof numero1 !== "number" || typeof numero2 !== "number") {
    return "Erro: Somente valor númerico";
  }

  if (String(numero1).length <= 0 || String(numero2).length <= 0) {
    return "Erro";
  }

  const resultado = numero1 / numero2;

  if (isNaN(resultado)) {
    return "Erro: valor do primeiro número deve ser maior que 0 (ZERO)";
  }

  if (resultado === Infinity) {
    return "Erro: valor do segundo número deve ser maior que 0 (ZERO)";
  }
  return resultado;
}

exports.somar = somar;
exports.dividir = dividir;
