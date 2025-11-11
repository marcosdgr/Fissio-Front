// Componente para el formulario completo de feedback
import FeedbackEstrellas from "./FeedbackEstrellas";
import FeedbackComentario from "./FeedbackComentario";

const FeedbackFormulario = ({ 
  calificacion, 
  calificacionHover,
  comentario, 
  loading,
  onCalificacionChange,
  onHoverChange,
  onComentarioChange,
  onSubmit 
}) => {
  
  const puedeEnviar = calificacion > 0 && comentario.trim() && !loading;

  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <div className="icon-emoji">💬</div>
        <h1>¿Cómo fue tu experiencia?</h1>
        <p>Tu opinión es muy importante para nosotros</p>
      </div>

      <form onSubmit={onSubmit} className="feedback-form">
        <FeedbackEstrellas
          calificacion={calificacion}
          calificacionHover={calificacionHover}
          onCalificacionChange={onCalificacionChange}
          onHoverChange={onHoverChange}
        />

        <FeedbackComentario
          comentario={comentario}
          onComentarioChange={onComentarioChange}
        />

        <button
          type="submit"
          className="btn-enviar"
          disabled={!puedeEnviar}
        >
          {loading ? (
            <>⏳ Enviando...</>
          ) : (
            <>📤 Enviar Comentario</>
          )}
        </button>
      </form>

      <div className="feedback-footer">
        <div className="icon-emoji">🔒</div>
        <p>
          Tu privacidad es importante. Tu comentario será moderado antes de
          publicarse.
        </p>
      </div>
    </div>
  );
};

export default FeedbackFormulario;
