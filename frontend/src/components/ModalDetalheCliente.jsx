


function ModalDetalheCliente({ cliente, aoFechar }) {
  if (!cliente) return null

  var end = cliente.endereco

  return (
    <div className="fundo-modal">
      <div className="caixa-modal">

        <div className="cabecalho-modal">
          <h2>👤 Detalhes do Cliente</h2>
          <button className="btn-fechar-modal" onClick={aoFechar}>×</button>
        </div>

        <div className="corpo-modal">

          {}
          <p className="titulo-secao">Dados Pessoais</p>
          <div className="grade-2">
            <div className="grupo-campo">
              <label>Nome</label>
              <input type="text" value={cliente.nome} readOnly style={{ background: '#f8f9fa' }} />
            </div>
            <div className="grupo-campo">
              <label>CPF</label>
              <input type="text" value={cliente.cpf} readOnly style={{ background: '#f8f9fa' }} />
            </div>
          </div>

          <hr className="divisor" />

          {}
          <p className="titulo-secao">Endereço</p>
          {end ? (
            <>
              <div className="grade-2">
                <div className="grupo-campo">
                  <label>CEP</label>
                  <input type="text" value={end.cep || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
                <div className="grupo-campo">
                  <label>Logradouro</label>
                  <input type="text" value={end.logradouro || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
              </div>
              <div className="grade-3">
                <div className="grupo-campo">
                  <label>Bairro</label>
                  <input type="text" value={end.bairro || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
                <div className="grupo-campo">
                  <label>Cidade</label>
                  <input type="text" value={end.cidade || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
                <div className="grupo-campo">
                  <label>UF</label>
                  <input type="text" value={end.uf || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
              </div>
              <div className="grade-2">
                <div className="grupo-campo">
                  <label>Número</label>
                  <input type="text" value={end.numero || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
                <div className="grupo-campo">
                  <label>Complemento</label>
                  <input type="text" value={end.complemento || ''} readOnly style={{ background: '#f8f9fa' }} />
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: '#aaa', fontSize: 13 }}>Endereço não informado</p>
          )}

          <hr className="divisor" />

          {}
          <p className="titulo-secao">Telefones</p>
          {cliente.telefones && cliente.telefones.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cliente.telefones.map(function(tel, i) {
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{
                      background: '#e8f4fd', color: '#1a3a5c',
                      borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600
                    }}>
                      {tel.tipo}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: 14 }}>{tel.numero}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: '#aaa', fontSize: 13 }}>Nenhum telefone</p>
          )}

          <hr className="divisor" />

          {}
          <p className="titulo-secao">E-mails</p>
          {cliente.emails && cliente.emails.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {cliente.emails.map(function(email, i) {
                return (
                  <span key={i} style={{ fontFamily: 'monospace', fontSize: 14, color: '#333' }}>
                    {email.endereco}
                  </span>
                )
              })}
            </div>
          ) : (
            <p style={{ color: '#aaa', fontSize: 13 }}>Nenhum e-mail</p>
          )}

        </div>

        <div className="rodape-modal">
          <button className="btn btn-secundario" onClick={aoFechar}>Fechar</button>
        </div>

      </div>
    </div>
  )
}

export default ModalDetalheCliente
