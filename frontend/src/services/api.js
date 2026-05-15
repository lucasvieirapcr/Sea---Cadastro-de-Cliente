


import axios from 'axios'




const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json', 
  },
})




api.interceptors.request.use(function(configuracao) {
  
  const dadosUsuario = localStorage.getItem('usuario_logado')

  if (dadosUsuario) {
    const usuario = JSON.parse(dadosUsuario) 
    if (usuario.token) {
      
      configuracao.headers.Authorization = 'Bearer ' + usuario.token
    }
  }

  return configuracao
})




api.interceptors.response.use(
  function(resposta) {
    return resposta 
  },
  function(erro) {
    if (erro.response && erro.response.status === 401) {
      
      localStorage.removeItem('usuario_logado')
      window.location.href = '/login'
    }
    return Promise.reject(erro) 
  }
)

export default api
