import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../Store/useAuthStore";
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
  const [ultimaCalificacion, setUltimaCalificacion] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

 
  useEffect(() => {
    if (userData && userData.idUsuario) {
      setIdUsuario(userData.idUsuario);
      setCargando(false);
    }

  }, [userData]);


  if (!user) {
    return (
      <FeedbackMensaje
        tipo="error"
        titulo="Acceso restringido"
        mensaje="Por favor, inicia sesión para dejar tu comentario."
      />
    );
  }


  if (userData.NombreRol !== "Paciente") {
    return (
      <FeedbackMensaje
        tipo="error"
        titulo="Acceso restringido"
        mensaje="Solo los pacientes pueden dejar comentarios."
      />
    );
  }


  if (cargando) {
    return (
      <FeedbackMensaje
        tipo="cargando"
        mensaje="Cargando datos del paciente..."
      />
    );
  }


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


  const enviarComentario = async (e) => {
    e.preventDefault();

    if (calificacion === 0) {
      alert("Por favor, selecciona una calificación");
      return;
    }

    if (!comentario.trim()) {
      alert("Por favor, escribe tu comentario");
      return;
    }

    if (!idUsuario) {
      alert("No se pudo identificar al paciente. Por favor, recarga la página.");
      return;
    }

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
      
  setUltimaCalificacion(calificacion);
  setCalificacion(0);
  setComentario("");
  setEnviado(true);
      
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


  const nuevoComentario = () => {
    setEnviado(false);
    setCalificacion(0);
    setComentario("");
    setUltimaCalificacion(null);
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
          calificacion={ultimaCalificacion ?? 0}
          onNuevoComentario={nuevoComentario}
        />
      )}
    </div>
  );
};

export default Feedback;
