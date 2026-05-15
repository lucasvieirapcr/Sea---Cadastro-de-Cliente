



import { Outlet, useNavigate } from 'react-router-dom'



function Layout({ aoNotificar }) {
  var navegar = useNavigate() 

  
  var dadosUsuarioTexto = localStorage.getItem('usuario_logado')
  var usuario = dadosUsuarioTexto ? JSON.parse(dadosUsuarioTexto) : null

  function fazerLogout() {
    
    localStorage.removeItem('usuario_logado')
    
    aoNotificar('Sessão encerrada com sucesso!', 'sucesso')
    
    navegar('/login')
  }

  return (
    <div className="layout">

      {}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>SEA</h2>
          <small>Gestão de Clientes</small>
        </div>

        <nav className="sidebar-nav">
          <a href="/" className="ativo">
            👥 Clientes
          </a>
        </nav>

        {}
        <div className="sidebar-usuario">
          <strong>{usuario ? usuario.username : 'Usuário'}</strong>
          <span>
            {usuario && usuario.papel === 'ADMIN' ? '🔑 Administrador' : '👁 Visualizador'}
          </span>
          <button className="btn-sair" onClick={fazerLogout}>
            Sair
          </button>
        </div>
      </aside>

      {}
      {}
      <main className="conteudo">
        <Outlet />
      </main>

    </div>
  )
}

export default Layout
