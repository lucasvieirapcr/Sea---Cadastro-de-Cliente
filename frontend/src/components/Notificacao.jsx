



import { useEffect } from 'react'





function Notificacao({ mensagem, tipo, aoFechar }) {

  
  
  useEffect(function() {
    
    var timer = setTimeout(function() {
      aoFechar() 
    }, 3000)

    
    
    return function() {
      clearTimeout(timer)
    }
  }, []) 

  if (!mensagem) return null 

  return (
    <div className={'notificacao ' + tipo}>
      {tipo === 'sucesso' ? '✅ ' : '❌ '}
      {mensagem}
    </div>
  )
}

export default Notificacao
