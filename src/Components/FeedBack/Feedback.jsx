import { useState, useEffect } from "react";
import { useAuthStore } from "../../Store/useAuthStore";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import "../../Css/Feedback/Feedback.css";
import FeedbackMensaje from "./FeedbackMensaje";
import FeedbackFormulario from "./FeedbackFormulario";
import FeedbackExito from "./FeedbackExito";

const Feedback = () => {
  const { user } = useAuthStore();
  const userData = user?.usuario || user;

  const [calificacion, setCalificacion] = useState(0);
  const [calificacionHover, setCalificacionHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Cargar el ID del usuario al iniciar
  useEffect(() => {
    if (userData && userData.idUsuario) {
      setIdUsuario(userData.idUsuario);
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verificar si el usuario no está logueado
  if (!user) {
    return (
      <FeedbackMensaje
        tipo="error"
        titulo="Acceso restringido"
        mensaje="Por favor, inicia sesión para dejar tu comentario."
      />
    );
  }

  // Verificar si el usuario no es paciente
  if (userData.NombreRol !== "Paciente") {
    return (
      <FeedbackMensaje
        tipo="error"
        titulo="Acceso restringido"
        mensaje="Solo los pacientes pueden dejar comentarios."
      />
    );
  }

  // Mostrar pantalla de carga
  if (cargando) {
    return (
      <FeedbackMensaje
        tipo="cargando"
        mensaje="Cargando datos del paciente..."
      />
    );
  }

  // Verificar si no se pudo cargar el ID del usuario
  if (!idUsuario && userData && userData.NombreRol === "Paciente") {
    const mensajeError = (
      <>
        <p>No se pudo obtener la información del paciente.</p>
        <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
          Usuario ID: {userData.idUsuario}<br/>
          Rol: {userData.NombreRol}
        </p>
      </>
    );

    return (
      <FeedbackMensaje
        tipo="error"
        titulo="Error al cargar datos"
        mensaje={mensajeError}
        botonTexto="Recargar página"
        onBotonClick={() => window.location.reload()}
      />
    );
  }

  // Función para enviar el comentario
  const enviarComentario = async (e) => {
    e.preventDefault();

    // Validar calificación
    if (calificacion === 0) {
      alert("Por favor, selecciona una calificación");
      return;
    }

    // Validar comentario
    if (!comentario.trim()) {
      alert("Por favor, escribe tu comentario");
      return;
    }

    // Validar ID de usuario
    if (!idUsuario) {
      alert("No se pudo identificar al paciente. Por favor, recarga la página.");
      return;
    }

    // Intentar enviar el comentario
    try {
      setEnviando(true);
      
      const datosComentario = {
        CalificacionComentario: calificacion,
        Comentario: comentario.trim(),
        idUsuario: idUsuario,
      };
      
      const respuesta = await axios.post(
        `${BASE_URL}api/comentarios/v1/crear`, 
        datosComentario
      );
      
      console.log("Comentario enviado:", respuesta.data);
      
      // Limpiar formulario y mostrar éxito
      setEnviado(true);
      setCalificacion(0);
      setComentario("");
      
    } catch (error) {
      console.error("Error al enviar:", error);
      
      const mensajeError = error.response?.data?.message 
        || error.response?.data?.error 
        || "Error al enviar el comentario";
      
      alert(mensajeError);
      
    } finally {
      setEnviando(false);
    }
  };

  // Función para resetear el formulario
  const nuevoComentario = () => {
    setEnviado(false);
    setCalificacion(0);
    setComentario("");
  };

  return (
    <div className="feedback-container">
      {!enviado ? (
        <FeedbackFormulario
          calificacion={calificacion}
          calificacionHover={calificacionHover}
          comentario={comentario}
          loading={enviando}
          onCalificacionChange={setCalificacion}
          onHoverChange={setCalificacionHover}
          onComentarioChange={setComentario}
          onSubmit={enviarComentario}
        />
      ) : (
        <FeedbackExito
          calificacion={calificacion}
          onNuevoComentario={nuevoComentario}
        />
      )}
    </div>
  );
};

export default Feedback;
