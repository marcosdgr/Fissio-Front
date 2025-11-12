// Componente para mostrar el mensaje de éxito
const FeedbackExito = ({ calificacion, onNuevoComentario }) => {
  return (
    <div className="feedback-card success-card">
      <div className="success-icon">
        <div className="icon-emoji">✅</div>
      </div>
      <h2>¡Gracias por tu comentario!</h2>
      <p>Tu opinión nos ayuda a mejorar cada día.</p>
      <p className="success-message">
        Hemos recibido tu calificación de{" "}
        <strong>{calificacion} estrellas</strong> y tu reseña.
      </p>

      <div className="success-actions">
        <button
          className="btn-nuevo-comentario"
          onClick={onNuevoComentario}
        >
          ➕ Dejar otro comentario
        </button>
      </div>
    </div>
  );
};

export default FeedbackExito;
