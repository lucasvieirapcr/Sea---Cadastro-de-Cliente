




export function somenteNumeros(texto) {
  if (!texto) return ''
  return texto.replace(/\D/g, '') 
}



export function mascaraCpf(valor) {
  var numeros = somenteNumeros(valor).slice(0, 11) 

  
  if (numeros.length <= 3) return numeros
  if (numeros.length <= 6) return numeros.slice(0,3) + '.' + numeros.slice(3)
  if (numeros.length <= 9) return numeros.slice(0,3) + '.' + numeros.slice(3,6) + '.' + numeros.slice(6)
  return numeros.slice(0,3) + '.' + numeros.slice(3,6) + '.' + numeros.slice(6,9) + '-' + numeros.slice(9)
}



export function mascaraCep(valor) {
  var numeros = somenteNumeros(valor).slice(0, 8) 

  if (numeros.length <= 5) return numeros
  return numeros.slice(0, 5) + '-' + numeros.slice(5)
}




export function mascaraTelefone(valor, tipo) {
  var numeros = somenteNumeros(valor)

  if (tipo === 'CELULAR') {
    numeros = numeros.slice(0, 11) 
    if (numeros.length <= 2)  return numeros
    if (numeros.length <= 7)  return '(' + numeros.slice(0,2) + ') ' + numeros.slice(2)
    return '(' + numeros.slice(0,2) + ') ' + numeros.slice(2,7) + '-' + numeros.slice(7)
  } else {
    numeros = numeros.slice(0, 10) 
    if (numeros.length <= 2)  return numeros
    if (numeros.length <= 6)  return '(' + numeros.slice(0,2) + ') ' + numeros.slice(2)
    return '(' + numeros.slice(0,2) + ') ' + numeros.slice(2,6) + '-' + numeros.slice(6)
  }
}
