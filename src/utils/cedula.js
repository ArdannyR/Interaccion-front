export function validarCedulaEcuatoriana(cedula) {
  if (typeof cedula !== 'string' || cedula.length !== 10 || !/^\d+$/.test(cedula)) {
    return false;
  }

  const digito_region = parseInt(cedula.substring(0, 2), 10);
  if (digito_region < 1 || digito_region > 24) {
    return false;
  }

  const tercer_digito = parseInt(cedula.substring(2, 3), 10);
  if (tercer_digito < 0 || tercer_digito > 5) {
    return false;
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const decena_superior = Math.ceil(suma / 10) * 10;
  let digito_verificador = decena_superior - suma;

  if (digito_verificador === 10) {
    digito_verificador = 0;
  }

  const ultimo_digito = parseInt(cedula.charAt(9), 10);
  return digito_verificador === ultimo_digito;
}
