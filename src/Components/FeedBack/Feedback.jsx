import { useState, useEffect } from "react";
import { useAuthStore } from "../../Store/useAuthStore";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import "../../Css/Feedback/Feedback.css";

const Feedback = () => {
  const { user } = useAuthStore();
  const userData = user?.usuario || user;

  const [calificacion, setCalificacion] = useState(0);
  const [calificacionHover, setCalificacionHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [idPaciente, setIdPaciente] = useState(null); // Ahora guardará idUsuario
  const [buscandoPaciente, setBuscandoPaciente] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ya no necesitamos buscar idPaciente, usaremos idUsuario directamente
  useEffect(() => {
    // Simplemente verificamos que el usuario esté cargado
    if (userData && userData.idUsuario) {
      console.log("Usuario cargado - idUsuario:", userData.idUsuario);
      setIdPaciente(userData.idUsuario); // Ahora guardamos el idUsuario aquí
      setBuscandoPaciente(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <p>Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  if (!idPaciente && userData && userData.NombreRol === "Paciente") {
    return (
      <div className="feedback-container">
        <div className="feedback-card error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error al cargar datos</h3>
          <p>No se pudo obtener la información del paciente.</p>
          <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
            Usuario ID: {userData.idUsuario}<br/>
            Rol: {userData.NombreRol}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer'}}
          >
            Recargar página
          </button>
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

    if (!idPaciente) {
      return alert("No se pudo identificar al paciente. Por favor, recarga la página.");
    }

    // Enviar comentario
    try {
      setLoading(true);
      const payload = {
        CalificacionComentario: calificacion,
        Comentario: comentario.trim(),
        idUsuario: idPaciente, // Enviamos idUsuario, el backend buscará el idPaciente
      };
      
      console.log("Enviando comentario:", payload);
      
      const response = await axios.post(`${BASE_URL}api/comentarios/v1/`, payload);
      
      console.log("Respuesta exitosa:", response.data);
      
      setEnviado(true);
      setCalificacion(0);
      setComentario("");
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Error al enviar el comentario";
      
      alert(errorMsg);
    } finally {
      setLoading(false);
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
                    <i className={star <= (calificacionHover || calificacion) ? "fas fa-star" : "far fa-star"}></i>
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
