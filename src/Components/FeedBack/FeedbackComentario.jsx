// Componente para el área de texto del comentario
const FeedbackComentario = ({ comentario, onComentarioChange }) => {
  return (
    <div className="comentario-section">
      <label className="comentario-label">
        Cuéntanos tu experiencia:
      </label>

      <textarea
        className="comentario-textarea"
        placeholder="Comparte tus comentarios sobre nuestro servicio..."
        value={comentario}
        onChange={(e) => onComentarioChange(e.target.value)}
        rows={6}
        required
      />

      <div className="contador-caracteres">
        {comentario.length} caracteres
      </div>
    </div>
  );
};

export default FeedbackComentario;
