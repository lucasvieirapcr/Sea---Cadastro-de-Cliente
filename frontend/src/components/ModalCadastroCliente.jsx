





import { useState, useEffect } from 'react'
import { mascaraCpf, mascaraCep, mascaraTelefone, somenteNumeros } from '../utils/mascaras'
import { consultarCep, criarCliente, atualizarCliente } from '../services/clienteService'






function ModalCadastroCliente({ clienteParaEditar, aoFechar, aoSalvar, aoNotificar }) {
  var editando = clienteParaEditar !== null && clienteParaEditar !== undefined

  
  var [abaAtual, setAbaAtual] = useState('dados')

  
  var [nome, setNome] = useState('')
  var [cpf, setCpf] = useState('')

  
  var [cep, setCep] = useState('')
  var [logradouro, setLogradouro] = useState('')
  var [bairro, setBairro] = useState('')
  var [cidade, setCidade] = useState('')
  var [uf, setUf] = useState('')
  var [numero, setNumero] = useState('')
  var [complemento, setComplemento] = useState('')
  var [buscandoCep, setBuscandoCep] = useState(false)

  
  var [telefones, setTelefones] = useState([{ numero: '', tipo: 'CELULAR' }])
  var [emails, setEmails] = useState([{ endereco: '' }])

  
  var [erros, setErros] = useState({})

  
  var [carregando, setCarregando] = useState(false)

  
  
  useEffect(function() {
    if (editando) {
      setNome(clienteParaEditar.nome || '')
      setCpf(clienteParaEditar.cpf || '')

      if (clienteParaEditar.endereco) {
        setCep(clienteParaEditar.endereco.cep || '')
        setLogradouro(clienteParaEditar.endereco.logradouro || '')
        setBairro(clienteParaEditar.endereco.bairro || '')
        setCidade(clienteParaEditar.endereco.cidade || '')
        setUf(clienteParaEditar.endereco.uf || '')
        setNumero(clienteParaEditar.endereco.numero || '')
        setComplemento(clienteParaEditar.endereco.complemento || '')
      }

      if (clienteParaEditar.telefones && clienteParaEditar.telefones.length > 0) {
        setTelefones(clienteParaEditar.telefones.map(function(t) {
          return { numero: t.numero, tipo: t.tipo }
        }))
      }

      if (clienteParaEditar.emails && clienteParaEditar.emails.length > 0) {
        setEmails(clienteParaEditar.emails.map(function(e) {
          return { endereco: e.endereco }
        }))
      }
    }
  }, []) 

  
  
  
  function handleCepBlur() {
    var cepSoNumeros = somenteNumeros(cep)
    if (cepSoNumeros.length !== 8) return 

    setBuscandoCep(true)
    consultarCep(cepSoNumeros)
      .then(function(dados) {
        
        setLogradouro(dados.logradouro || '')
        setBairro(dados.bairro || '')
        setCidade(dados.cidade || '')
        setUf(dados.uf || '')
        setComplemento(dados.complemento || '')
        aoNotificar('Endereço preenchido automaticamente!', 'sucesso')
      })
      .catch(function() {
        aoNotificar('CEP não encontrado. Preencha manualmente.', 'erro')
      })
      .finally(function() {
        setBuscandoCep(false)
      })
  }

  
  
  
  function adicionarTelefone() {
    setTelefones(function(lista) {
      return lista.concat([{ numero: '', tipo: 'CELULAR' }])
    })
  }

  function removerTelefone(indice) {
    setTelefones(function(lista) {
      return lista.filter(function(_, i) { return i !== indice })
    })
  }

  function atualizarTelefone(indice, campo, valor) {
    setTelefones(function(lista) {
      return lista.map(function(tel, i) {
        if (i !== indice) return tel
        var novo = { numero: tel.numero, tipo: tel.tipo }
        novo[campo] = valor
        return novo
      })
    })
  }

  
  
  
  function adicionarEmail() {
    setEmails(function(lista) {
      return lista.concat([{ endereco: '' }])
    })
  }

  function removerEmail(indice) {
    setEmails(function(lista) {
      return lista.filter(function(_, i) { return i !== indice })
    })
  }

  function atualizarEmail(indice, valor) {
    setEmails(function(lista) {
      return lista.map(function(email, i) {
        if (i !== indice) return email
        return { endereco: valor }
      })
    })
  }

  
  
  
  function handleSalvar() {
    setCarregando(true)
    setErros({})

    
    
    var payload = {
      nome: nome,
      cpf: somenteNumeros(cpf),
      endereco: {
        cep: somenteNumeros(cep),
        logradouro: logradouro,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        numero: numero,
        complemento: complemento
      },
      telefones: telefones.map(function(t) {
        return { numero: somenteNumeros(t.numero), tipo: t.tipo }
      }),
      emails: emails
    }

    
    var promessa = editando
      ? atualizarCliente(clienteParaEditar.id, payload)
      : criarCliente(payload)

    promessa
      .then(function() {
        aoNotificar(
          editando ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!',
          'sucesso'
        )
        aoSalvar()  
        aoFechar()  
      })
      .catch(function(erro) {
        if (erro.response && erro.response.data) {
          var dados = erro.response.data

          
          if (dados.erros) {
            setErros(dados.erros)
            
            var primeirosErros = Object.keys(dados.erros)
            if (primeirosErros.some(function(e) { return e === 'nome' || e === 'cpf' })) {
              setAbaAtual('dados')
            } else if (primeirosErros.some(function(e) { return e.startsWith('endereco') || e === 'cep' })) {
              setAbaAtual('endereco')
            } else {
              setAbaAtual('contato')
            }
          } else if (dados.mensagem) {
            aoNotificar(dados.mensagem, 'erro')
          }
        } else {
          aoNotificar('Erro ao salvar. Tente novamente.', 'erro')
        }
      })
      .finally(function() {
        setCarregando(false)
      })
  }

  
  function abaTemErro(aba) {
    if (aba === 'dados') return !!(erros.nome || erros.cpf)
    if (aba === 'endereco') return !!(erros.cep || erros.logradouro || erros.bairro || erros.cidade || erros.uf)
    if (aba === 'contato') return !!(erros.telefones || erros.emails)
    return false
  }

  return (
    <div className="fundo-modal">
      <div className="caixa-modal">

        {}
        <div className="cabecalho-modal">
          <h2>{editando ? '✏️ Editar Cliente' : '➕ Novo Cliente'}</h2>
          <button className="btn-fechar-modal" onClick={aoFechar}>×</button>
        </div>

        {}
        <div className="abas">
          {[
            { id: 'dados',    label: '1. Dados' },
            { id: 'endereco', label: '2. Endereço' },
            { id: 'contato',  label: '3. Contato' },
          ].map(function(aba) {
            return (
              <button
                key={aba.id}
                className={'aba' + (abaAtual === aba.id ? ' ativa' : '') + (abaTemErro(aba.id) ? ' com-erro' : '')}
                onClick={function() { setAbaAtual(aba.id) }}
              >
                {aba.label}
                {abaTemErro(aba.id) && ' ⚠️'}
              </button>
            )
          })}
        </div>

        {}
        <div className="corpo-modal">

          {}
          {abaAtual === 'dados' && (
            <div>
              <p className="titulo-secao">Dados Pessoais</p>

              <div className="grupo-campo">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={nome}
                  onChange={function(e) { setNome(e.target.value) }}
                  className={erros.nome ? 'invalido' : ''}
                  maxLength={100}
                />
                {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
              </div>

              <div className="grupo-campo">
                <label htmlFor="cpf">CPF *</label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={function(e) { setCpf(mascaraCpf(e.target.value)) }}
                  className={erros.cpf ? 'invalido' : ''}
                  maxLength={14}
                />
                {erros.cpf && <span className="mensagem-erro">{erros.cpf}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-primario" onClick={function() { setAbaAtual('endereco') }}>
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {}
          {abaAtual === 'endereco' && (
            <div>
              <p className="titulo-secao">Endereço</p>

              <div className="grade-2">
                <div className="grupo-campo">
                  <label htmlFor="cep">CEP * {buscandoCep && '(buscando...)'}</label>
                  <input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={function(e) { setCep(mascaraCep(e.target.value)) }}
                    onBlur={handleCepBlur}
                    className={erros.cep ? 'invalido' : ''}
                    maxLength={9}
                  />
                  {erros.cep && <span className="mensagem-erro">{erros.cep}</span>}
                  <small style={{ color: '#888', fontSize: 11 }}>Sai do campo para buscar automaticamente</small>
                </div>

                <div className="grupo-campo">
                  <label htmlFor="logradouro">Logradouro *</label>
                  <input
                    id="logradouro"
                    type="text"
                    placeholder="Rua, Avenida..."
                    value={logradouro}
                    onChange={function(e) { setLogradouro(e.target.value) }}
                    className={erros.logradouro ? 'invalido' : ''}
                  />
                  {erros.logradouro && <span className="mensagem-erro">{erros.logradouro}</span>}
                </div>
              </div>

              <div className="grade-3">
                <div className="grupo-campo">
                  <label htmlFor="bairro">Bairro *</label>
                  <input
                    id="bairro"
                    type="text"
                    placeholder="Bairro"
                    value={bairro}
                    onChange={function(e) { setBairro(e.target.value) }}
                    className={erros.bairro ? 'invalido' : ''}
                  />
                  {erros.bairro && <span className="mensagem-erro">{erros.bairro}</span>}
                </div>

                <div className="grupo-campo">
                  <label htmlFor="cidade">Cidade *</label>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Cidade"
                    value={cidade}
                    onChange={function(e) { setCidade(e.target.value) }}
                    className={erros.cidade ? 'invalido' : ''}
                  />
                  {erros.cidade && <span className="mensagem-erro">{erros.cidade}</span>}
                </div>

                <div className="grupo-campo">
                  <label htmlFor="uf">UF *</label>
                  <input
                    id="uf"
                    type="text"
                    placeholder="DF"
                    value={uf}
                    onChange={function(e) { setUf(e.target.value.toUpperCase().slice(0, 2)) }}
                    className={erros.uf ? 'invalido' : ''}
                    maxLength={2}
                  />
                  {erros.uf && <span className="mensagem-erro">{erros.uf}</span>}
                </div>
              </div>

              <div className="grade-2">
                <div className="grupo-campo">
                  <label htmlFor="numero">Número</label>
                  <input
                    id="numero"
                    type="text"
                    placeholder="123"
                    value={numero}
                    onChange={function(e) { setNumero(e.target.value) }}
                  />
                </div>

                <div className="grupo-campo">
                  <label htmlFor="complemento">Complemento</label>
                  <input
                    id="complemento"
                    type="text"
                    placeholder="Apto 10, Bloco B..."
                    value={complemento}
                    onChange={function(e) { setComplemento(e.target.value) }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <button className="btn btn-secundario" onClick={function() { setAbaAtual('dados') }}>
                  ← Voltar
                </button>
                <button className="btn btn-primario" onClick={function() { setAbaAtual('contato') }}>
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {}
          {abaAtual === 'contato' && (
            <div>

              {}
              <p className="titulo-secao">Telefones (mínimo 1) *</p>
              <div className="lista-dinamica" style={{ marginBottom: 16 }}>
                {telefones.map(function(tel, i) {
                  return (
                    <div key={i} className="item-dinamico">
                      <select
                        value={tel.tipo}
                        onChange={function(e) { atualizarTelefone(i, 'tipo', e.target.value) }}
                        style={{ width: 150, flexShrink: 0 }}
                      >
                        <option value="CELULAR">Celular</option>
                        <option value="RESIDENCIAL">Residencial</option>
                        <option value="COMERCIAL">Comercial</option>
                      </select>

                      <input
                        type="text"
                        placeholder={tel.tipo === 'CELULAR' ? '(00) 00000-0000' : '(00) 0000-0000'}
                        value={tel.numero}
                        onChange={function(e) {
                          atualizarTelefone(i, 'numero', mascaraTelefone(e.target.value, tel.tipo))
                        }}
                        maxLength={tel.tipo === 'CELULAR' ? 15 : 14}
                      />

                      <button
                        className="btn btn-perigo btn-pequeno"
                        onClick={function() { removerTelefone(i) }}
                        disabled={telefones.length === 1}
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}

                <button
                  className="btn btn-secundario btn-pequeno"
                  onClick={adicionarTelefone}
                  style={{ alignSelf: 'flex-start', marginTop: 4 }}
                >
                  + Adicionar telefone
                </button>
              </div>

              <hr className="divisor" />

              {}
              <p className="titulo-secao">E-mails (mínimo 1) *</p>
              <div className="lista-dinamica">
                {emails.map(function(email, i) {
                  return (
                    <div key={i} className="item-dinamico">
                      <input
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email.endereco}
                        onChange={function(e) { atualizarEmail(i, e.target.value) }}
                      />
                      <button
                        className="btn btn-perigo btn-pequeno"
                        onClick={function() { removerEmail(i) }}
                        disabled={emails.length === 1}
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}

                <button
                  className="btn btn-secundario btn-pequeno"
                  onClick={adicionarEmail}
                  style={{ alignSelf: 'flex-start', marginTop: 4 }}
                >
                  + Adicionar e-mail
                </button>
              </div>

            </div>
          )}
        </div>

        {}
        <div className="rodape-modal">
          <button className="btn btn-secundario" onClick={aoFechar} disabled={carregando}>
            Cancelar
          </button>
          <button className="btn btn-primario" onClick={handleSalvar} disabled={carregando}>
            {carregando ? 'Salvando...' : (editando ? '💾 Salvar Alterações' : '✅ Criar Cliente')}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalCadastroCliente
