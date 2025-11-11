// Componente para mostrar mensajes de error o carga
const FeedbackMensaje = ({ tipo, titulo, mensaje, botonTexto, onBotonClick }) => {
  const iconos = {
    error: "⚠️",
    cargando: "⏳"
  };

  return (
    <div className="feedback-container">
      <div className={`feedback-card ${tipo === 'error' ? 'error-card' : 'loading-card'}`}>
        <div className="icon-emoji">{iconos[tipo]}</div>
        
        {titulo && <h3>{titulo}</h3>}
        
        {typeof mensaje === 'string' ? (
          <p>{mensaje}</p>
        ) : (
          mensaje
        )}
        
        {botonTexto && onBotonClick && (
          <button 
            onClick={onBotonClick}
            style={{marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}
          >
            {botonTexto}
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackMensaje;
