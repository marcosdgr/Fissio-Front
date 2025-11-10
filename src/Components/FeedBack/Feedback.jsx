import { useState, useEffect } from "react";
import { useAuthStore } from "../../Store/useAuthStore";
import useCustomFeedback from "../../Custom/Feedback/useCustomFeedback";
import { BASE_URL } from "../../Api/api";
import "../../Css/Feedback/Feedback.css";

const Feedback = () => {
  const { user } = useAuthStore();
  const userData = user?.usuario || user;
  const { crearComentario, loading } = useCustomFeedback();

  const [calificacion, setCalificacion] = useState(0);
  const [calificacionHover, setCalificacionHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [idPaciente, setIdPaciente] = useState(null);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Obtener idPaciente del usuario logueado
  useEffect(() => {
    const obtenerIdPaciente = async () => {
      if (
        userData &&
        userData.NombreRol === "Paciente" &&
        !idPaciente &&
        !buscandoPaciente
      ) {
        setBuscandoPaciente(true);
        try {
          const response = await fetch(`${BASE_URL}api/pacientes/v1`);
          const pacientes = await response.json();

          if (response.ok) {
            const paciente = pacientes.find(
              (p) => p.idUsuario === userData.idUsuario
            );
            if (paciente) {
              setIdPaciente(paciente.idPaciente);
            }
          }
        } catch (error) {
          console.error("Error al buscar paciente:", error);
        } finally {
          setBuscandoPaciente(false);
        }
      }
    };

    obtenerIdPaciente();
  }, [userData, idPaciente, buscandoPaciente]);

  // Validar que el usuario esté logueado y sea paciente
  if (!user) {
    return (
      <div className="feedback-container">
        <div className="feedback-card error-card">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Acceso restringido</h3>
          <p>Por favor, inicia sesión para dejar tu comentario.</p>
        </div>
      </div>
    );
  }

  if (userData.NombreRol !== "Paciente") {
    return (
      <div className="feedback-container">
        <div className="feedback-card error-card">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Acceso restringido</h3>
          <p>Solo los pacientes pueden dejar comentarios.</p>
        </div>
      </div>
    );
  }

  if (buscandoPaciente) {
    return (
      <div className="feedback-container">
        <div className="feedback-card loading-card">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Manejar el envío del comentario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (calificacion === 0) {
      return alert("Por favor, selecciona una calificación");
    }

    if (!comentario.trim()) {
      return alert("Por favor, escribe tu comentario");
    }

    // Enviar comentario
    try {
      await crearComentario({
        CalificacionComentario: calificacion,
        Comentario: comentario.trim(),
        idPaciente: idPaciente,
      });
      setEnviado(true);
      setCalificacion(0);
      setComentario("");
    } catch (error) {
      console.error("Error al crear comentario:", error);
      alert(error.response?.data?.message || "Error al enviar el comentario");
    }
  };

  // Resetear el formulario
  const resetearFormulario = () => {
    setEnviado(false);
    setCalificacion(0);
    setComentario("");
  };

  // Mensajes según la calificación
  const mensajesCalificacion = {
    1: "😞 Muy insatisfecho",
    2: "😕 Insatisfecho",
    3: "😐 Regular",
    4: "😊 Satisfecho",
    5: "😍 Muy satisfecho",
  };

  return (
    <div className="feedback-container">
      {!enviado ? (
        <div className="feedback-card">
          <div className="feedback-header">
            <i className="fas fa-comments"></i>
            <h1>¿Cómo fue tu experiencia?</h1>
            <p>Tu opinión es muy importante para nosotros</p>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Sección de calificación con estrellas */}
            <div className="calificacion-section">
              <label className="calificacion-label">
                Califica nuestro servicio:
              </label>

              <div className="estrellas-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`estrella ${
                      star <= (calificacionHover || calificacion)
                        ? "activa"
                        : ""
                    }`}
                    onClick={() => setCalificacion(star)}
                    onMouseEnter={() => setCalificacionHover(star)}
                    onMouseLeave={() => setCalificacionHover(0)}
                  >
                    <i className={`fas fa-star`}></i>
                  </button>
                ))}
              </div>

              {calificacion > 0 && (
                <div className="calificacion-mensaje">
                  <span className="mensaje-emoji">
                    {mensajesCalificacion[calificacion]}
                  </span>
                </div>
              )}
            </div>

            {/* Sección de comentario */}
            <div className="comentario-section">
              <label className="comentario-label">
                Cuéntanos tu experiencia:
              </label>

              <textarea
                className="comentario-textarea"
                placeholder="Comparte tus comentarios sobre nuestro servicio..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={6}
                required
              />

              <div className="contador-caracteres">
                {comentario.length} caracteres
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="btn-enviar"
              disabled={loading || calificacion === 0 || !comentario.trim()}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Enviar Comentario
                </>
              )}
            </button>
          </form>

          <div className="feedback-footer">
            <i className="fas fa-shield-alt"></i>
            <p>
              Tu privacidad es importante. Tu comentario será moderado antes de
              publicarse.
            </p>
          </div>
        </div>
      ) : (
        // Mensaje de éxito después de enviar
        <div className="feedback-card success-card">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
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
              onClick={resetearFormulario}
            >
              <i className="fas fa-plus-circle"></i>
              Dejar otro comentario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
