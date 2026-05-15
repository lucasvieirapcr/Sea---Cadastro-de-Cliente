




import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import PaginaLogin from './pages/PaginaLogin'
import PaginaClientes from './pages/PaginaClientes'
import Layout from './components/Layout'
import Notificacao from './components/Notificacao'

function App() {
  
  
  var [notificacao, setNotificacao] = useState(null)

  
  
  function mostrarNotificacao(mensagem, tipo) {
    setNotificacao({ mensagem: mensagem, tipo: tipo })
  }

  
  function fecharNotificacao() {
    setNotificacao(null)
  }

  
  function estaLogado() {
    return localStorage.getItem('usuario_logado') !== null
  }

  return (
    <div>
      {}
      {notificacao && (
        <Notificacao
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          aoFechar={fecharNotificacao}
        />
      )}

      {}
      <Routes>

        {}
        <Route
          path="/login"
          element={<PaginaLogin aoNotificar={mostrarNotificacao} />}
        />

        {}
        <Route
          path="/"
          element={
            estaLogado()
              ? <Layout aoNotificar={mostrarNotificacao} />
              : <Navigate to="/login" replace /> 
          }
        >
          {}
          <Route
            index
            element={<PaginaClientes aoNotificar={mostrarNotificacao} />}
          />
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  )
}

export default App
