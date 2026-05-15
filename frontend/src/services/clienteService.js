



import api from './api'



export function listarClientes() {
  return api.get('/clientes').then(function(resposta) {
    return resposta.data 
  })
}


export function buscarClientePorId(id) {
  return api.get('/clientes/' + id).then(function(resposta) {
    return resposta.data
  })
}



export function criarCliente(dados) {
  return api.post('/clientes', dados).then(function(resposta) {
    return resposta.data
  })
}


export function atualizarCliente(id, dados) {
  return api.put('/clientes/' + id, dados).then(function(resposta) {
    return resposta.data
  })
}


export function deletarCliente(id) {
  return api.delete('/clientes/' + id)
}


export function consultarCep(cep) {
  
  var cepSoNumeros = cep.replace(/\D/g, '')
  return api.get('/cep/' + cepSoNumeros).then(function(resposta) {
    return resposta.data
  })
}
