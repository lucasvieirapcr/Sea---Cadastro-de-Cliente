




import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'



function PaginaLogin({ aoNotificar }) {
  var navegar = useNavigate()

  
  
  var [username, setUsername] = useState('')
  var [senha, setSenha] = useState('')
  var [carregando, setCarregando] = useState(false) 
  var [erroLogin, setErroLogin] = useState('')      

  
  function handleSubmit(evento) {
    
    evento.preventDefault()

    
    if (!username.trim() || !senha.trim()) {
      setErroLogin('Preencha o usuário e a senha.')
      return
    }

    setCarregando(true)
    setErroLogin('')

    
    
    api.post('/auth/login', { username: username, senha: senha })
      .then(function(resposta) {
        
        var dadosUsuario = {
          token: resposta.data.token,
          papel: resposta.data.papel,
          username: resposta.data.username
        }
        localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario))

        aoNotificar('Bem-vindo, ' + dadosUsuario.username + '!', 'sucesso')
        navegar('/') 
      })
      .catch(function(erro) {
        
        var mensagem = 'Usuário ou senha incorretos.'
        if (erro.response && erro.response.data && erro.response.data.mensagem) {
          mensagem = erro.response.data.mensagem
        }
        setErroLogin(mensagem)
      })
      .finally(function() {
        setCarregando(false)
      })
  }

  return (
    <div className="pagina-login">
      <div className="caixa-login">

        {}
        <div className="logo-login">
          <h1>SEA</h1>
          <p>Sistema de Gestão de Clientes</p>
        </div>

        {}
        <form onSubmit={handleSubmit}>

          <div className="grupo-campo">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              placeholder="admin ou usuario"
              value={username}
              onChange={function(e) { setUsername(e.target.value) }}
              autoFocus
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={function(e) { setSenha(e.target.value) }}
            />
          </div>

          {}
          {erroLogin && (
            <p className="mensagem-erro" style={{ marginBottom: 12 }}>
              ❌ {erroLogin}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primario"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {}
        <div style={{
          marginTop: 24,
          padding: 14,
          background: '#f0f4ff',
          borderRadius: 8,
          fontSize: 13,
          color: '#555'
        }}>
          <strong>Credenciais de teste:</strong>
          <br />
          👑 admin / 123qwel@# — acesso total
          <br />
          👁 usuario / 123qwe123 — só visualizar
        </div>

      </div>
    </div>
  )
}

export default PaginaLogin
