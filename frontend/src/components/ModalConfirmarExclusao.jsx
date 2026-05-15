


function ModalConfirmarExclusao({ nomeCliente, aoConfirmar, aoCancelar, carregando }) {
  return (
    <div className="fundo-modal">
      <div className="caixa-modal" style={{ maxWidth: 420 }}>

        <div className="cabecalho-modal">
          <h2>⚠️ Confirmar exclusão</h2>
          <button className="btn-fechar-modal" onClick={aoCancelar}>×</button>
        </div>

        <div className="corpo-modal">
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            Tem certeza que deseja excluir o cliente{' '}
            <strong>{nomeCliente}</strong>?
            <br />
            <span style={{ color: '#c0392b', fontSize: 13 }}>
              Esta ação não pode ser desfeita.
            </span>
          </p>
        </div>

        <div className="rodape-modal">
          <button
            className="btn btn-secundario"
            onClick={aoCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            className="btn btn-perigo"
            onClick={aoConfirmar}
            disabled={carregando}
          >
            {carregando ? 'Excluindo...' : '🗑️ Excluir'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ModalConfirmarExclusao
