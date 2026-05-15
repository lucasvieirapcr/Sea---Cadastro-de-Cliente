




import { useState, useEffect } from 'react'
import { listarClientes, deletarCliente } from '../services/clienteService'
import ModalCadastroCliente from '../components/ModalCadastroCliente'
import ModalDetalheCliente from '../components/ModalDetalheCliente'
import ModalConfirmarExclusao from '../components/ModalConfirmarExclusao'



function PaginaClientes({ aoNotificar }) {

  
  var [clientes, setClientes] = useState([])

  
  var [carregando, setCarregando] = useState(true)

  
  var [textoBusca, setTextoBusca] = useState('')

  
  
  var [modalAberto, setModalAberto] = useState(null)
  

  
  var [clienteSelecionado, setClienteSelecionado] = useState(null)

  
  var [excluindo, setExcluindo] = useState(false)

  
  var dadosUsuario = localStorage.getItem('usuario_logado')
  var usuario = dadosUsuario ? JSON.parse(dadosUsuario) : null
  var ehAdmin = usuario && usuario.papel === 'ADMIN'

  
  
  
  
  useEffect(function() {
    carregarClientes()
  }, []) 

  function carregarClientes() {
    setCarregando(true)
    listarClientes()
      .then(function(lista) {
        setClientes(lista)
      })
      .catch(function() {
        aoNotificar('Erro ao carregar os clientes.', 'erro')
      })
      .finally(function() {
        setCarregando(false)
      })
  }

  
  
  
  var clientesFiltrados = clientes.filter(function(cliente) {
    if (!textoBusca.trim()) return true 

    var busca = textoBusca.toLowerCase()
    var temNome    = cliente.nome && cliente.nome.toLowerCase().includes(busca)
    var temCpf     = cliente.cpf && cliente.cpf.replace(/\D/g, '').includes(busca.replace(/\D/g, ''))
    var temCidade  = cliente.endereco && cliente.endereco.cidade &&
                     cliente.endereco.cidade.toLowerCase().includes(busca)
    var temEmail   = cliente.emails && cliente.emails.some(function(e) {
      return e.endereco && e.endereco.toLowerCase().includes(busca)
    })

    return temNome || temCpf || temCidade || temEmail
  })

  
  
  
  var totalTelefones = clientes.reduce(function(soma, c) {
    return soma + (c.telefones ? c.telefones.length : 0)
  }, 0)

  var totalEmails = clientes.reduce(function(soma, c) {
    return soma + (c.emails ? c.emails.length : 0)
  }, 0)

  
  var ufsUnicas = []
  clientes.forEach(function(c) {
    if (c.endereco && c.endereco.uf && !ufsUnicas.includes(c.endereco.uf)) {
      ufsUnicas.push(c.endereco.uf)
    }
  })

  
  
  
  function abrirCriar() {
    setClienteSelecionado(null)
    setModalAberto('criar')
  }

  function abrirEditar(cliente) {
    setClienteSelecionado(cliente)
    setModalAberto('editar')
  }

  function abrirDetalhe(cliente) {
    setClienteSelecionado(cliente)
    setModalAberto('detalhe')
  }

  function abrirExcluir(cliente) {
    setClienteSelecionado(cliente)
    setModalAberto('excluir')
  }

  function fecharModal() {
    setModalAberto(null)
    setClienteSelecionado(null)
  }

  function confirmarExclusao() {
    if (!clienteSelecionado) return
    setExcluindo(true)

    deletarCliente(clienteSelecionado.id)
      .then(function() {
        aoNotificar('Cliente excluído com sucesso!', 'sucesso')
        fecharModal()
        carregarClientes() 
      })
      .catch(function() {
        aoNotificar('Erro ao excluir o cliente.', 'erro')
      })
      .finally(function() {
        setExcluindo(false)
      })
  }

  
  
  
  return (
    <div>

      {}
      <div className="cabecalho-pagina">
        <div>
          <h1>Clientes</h1>
          <p>
            {carregando
              ? 'Carregando...'
              : clientes.length + ' cliente(s) cadastrado(s)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secundario" onClick={carregarClientes} disabled={carregando}>
            🔄 Atualizar
          </button>
          {}
          {ehAdmin && (
            <button className="btn btn-primario" onClick={abrirCriar}>
              ➕ Novo Cliente
            </button>
          )}
        </div>
      </div>

      {}
      <div className="cards-estatisticas">
        <div className="card-stat">
          <div className="numero">{clientes.length}</div>
          <div className="rotulo">Total de Clientes</div>
        </div>
        <div className="card-stat">
          <div className="numero">{totalTelefones}</div>
          <div className="rotulo">Telefones</div>
        </div>
        <div className="card-stat">
          <div className="numero">{totalEmails}</div>
          <div className="rotulo">E-mails</div>
        </div>
        <div className="card-stat">
          <div className="numero">{ufsUnicas.length}</div>
          <div className="rotulo">Estados (UF)</div>
        </div>
      </div>

      {}
      <div className="campo-busca">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, CPF, e-mail ou cidade..."
          value={textoBusca}
          onChange={function(e) { setTextoBusca(e.target.value) }}
        />
      </div>

      {}
      <div className="tabela-container">
        {carregando ? (
          <div className="carregando">Carregando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="estado-vazio">
            {textoBusca
              ? '😕 Nenhum cliente encontrado para "' + textoBusca + '"'
              : '📭 Nenhum cliente cadastrado ainda.'}
            {!textoBusca && ehAdmin && (
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primario" onClick={abrirCriar}>
                  ➕ Cadastrar primeiro cliente
                </button>
              </div>
            )}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cidade / UF</th>
                <th>Telefones</th>
                <th>E-mails</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(function(cliente) {
                return (
                  <tr key={cliente.id}>
                    <td>
                      <strong>{cliente.nome}</strong>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      {cliente.cpf}
                    </td>
                    <td style={{ fontSize: 13, color: '#555' }}>
                      {cliente.endereco
                        ? cliente.endereco.cidade + ' / ' + cliente.endereco.uf
                        : '—'}
                    </td>
                    <td>
                      <div className="chips">
                        {cliente.telefones && cliente.telefones.slice(0, 2).map(function(tel, i) {
                          return <span key={i} className="chip">{tel.numero}</span>
                        })}
                        {cliente.telefones && cliente.telefones.length > 2 && (
                          <span className="chip">+{cliente.telefones.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="chips">
                        {cliente.emails && cliente.emails.slice(0, 1).map(function(email, i) {
                          return (
                            <span key={i} className="chip" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {email.endereco}
                            </span>
                          )
                        })}
                        {cliente.emails && cliente.emails.length > 1 && (
                          <span className="chip">+{cliente.emails.length - 1}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {}
                        <button
                          className="btn btn-secundario btn-pequeno"
                          onClick={function() { abrirDetalhe(cliente) }}
                          title="Ver detalhes"
                        >
                          👁 Ver
                        </button>

                        {}
                        {ehAdmin && (
                          <>
                            <button
                              className="btn btn-secundario btn-pequeno"
                              onClick={function() { abrirEditar(cliente) }}
                              title="Editar"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-perigo btn-pequeno"
                              onClick={function() { abrirExcluir(cliente) }}
                              title="Excluir"
                            >
                              🗑️ Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {}
      {(modalAberto === 'criar' || modalAberto === 'editar') && (
        <ModalCadastroCliente
          clienteParaEditar={modalAberto === 'editar' ? clienteSelecionado : null}
          aoFechar={fecharModal}
          aoSalvar={carregarClientes}
          aoNotificar={aoNotificar}
        />
      )}

      {modalAberto === 'detalhe' && (
        <ModalDetalheCliente
          cliente={clienteSelecionado}
          aoFechar={fecharModal}
        />
      )}

      {modalAberto === 'excluir' && (
        <ModalConfirmarExclusao
          nomeCliente={clienteSelecionado ? clienteSelecionado.nome : ''}
          aoConfirmar={confirmarExclusao}
          aoCancelar={fecharModal}
          carregando={excluindo}
        />
      )}

    </div>
  )
}

export default PaginaClientes
