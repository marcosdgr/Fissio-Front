// calificación
const FeedbackEstrellas = ({ calificacion, calificacionHover, onCalificacionChange, onHoverChange }) => {
  
  const mensajes = {
    1: "😞 Muy insatisfecho",
    2: "😕 Insatisfecho",
    3: "😐 Regular",
    4: "😊 Satisfecho",
    5: "😍 Muy satisfecho",
  };

  return (
    <div className="calificacion-section">
      <label className="calificacion-label">
        Califica nuestro servicio:
      </label>

      <div className="estrellas-container">
        {[1, 2, 3, 4, 5].map((numero) => {
          const estaActiva = numero <= (calificacionHover || calificacion);
          
          return (
            <button
              key={numero}
              type="button"
              className={`estrella ${estaActiva ? "activa" : ""}`}
              onClick={() => onCalificacionChange(numero)}
              onMouseEnter={() => onHoverChange(numero)}
              onMouseLeave={() => onHoverChange(0)}
            >
              {estaActiva ? "★" : "☆"}
            </button>
          );
        })}
      </div>

      {calificacion > 0 && (
        <div className="calificacion-mensaje">
          <span className="mensaje-emoji">
            {mensajes[calificacion]}
          </span>
        </div>
      )}
    </div>
  );
};

export default FeedbackEstrellas;
