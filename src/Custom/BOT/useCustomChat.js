import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useState, useEffect } from "react";

const useCustomChat = () => {
  const [mensajes, setMensajes] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("chatSessionId") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar conversación automáticamente
  useEffect(() => {
    if (mensajes.length === 0) {
      iniciarConversacionAutomatica();
    }

  }, []);

  // Función para iniciar conversación automáticamente
  const iniciarConversacionAutomatica = async () => {
    // Generar o recuperar sessionId
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(currentSessionId);
      localStorage.setItem("chatSessionId", currentSessionId);
    }

    // Llamar al backend con "hola" para obtener el mensaje inicial
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}api/chat-web/v1/chat`, {
        sessionId: currentSessionId,
        message: "hola"
      });

      const { respuesta, sessionId: nuevaSesion } = response.data;

      // Actualizar sessionId si el backend devuelve uno nuevo
      if (nuevaSesion && nuevaSesion !== currentSessionId) {
        setSessionId(nuevaSesion);
        localStorage.setItem("chatSessionId", nuevaSesion);
      }

      // Agregar mensaje de bienvenida del bot
      const mensajeBot = { 
        sender: "bot", 
        text: respuesta || "¡Hola! Bienvenido a Fissio 👋\n\n¿Cuál es tu nombre?", 
        timestamp: new Date() 
      };
      
      setMensajes([mensajeBot]);
    } catch (err) {
      console.error("Error al iniciar conversación:", err);
      // Mensaje de fallback si el backend falla
      setMensajes([{ 
        sender: "bot", 
        text: "¡Hola! Bienvenido a Fissio 👋\n\n¿Cuál es tu nombre?", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar conversación con el bot (opcional - solo si el backend tiene este endpoint)
  const iniciarConversacion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}api/chat/v1/iniciar`);
      
      const { mensaje, sessionId: nuevaSesion } = response.data;

      // Guardar sessionId
      if (nuevaSesion) {
        setSessionId(nuevaSesion);
        localStorage.setItem("chatSessionId", nuevaSesion);
      }

      // Agregar mensaje de bienvenida del bot
      setMensajes([{ sender: "bot", text: mensaje, timestamp: new Date() }]);
    } catch (err) {
      console.error("Error al iniciar conversación:", err);
      setError(err);
      // Si falla, usar mensaje de bienvenida local
      setMensajes([{ 
        sender: "bot", 
        text: "¡Hola! 👋 Soy el asistente virtual de Fissio. ¿En qué puedo ayudarte hoy?", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje al backend
  const enviarMensaje = async (mensajeUsuario) => {
    if (!mensajeUsuario.trim()) return;

    // Agregar mensaje del usuario inmediatamente
    const mensajeUser = { sender: "usuario", text: mensajeUsuario, timestamp: new Date() };
    setMensajes((prev) => [...prev, mensajeUser]);

    setLoading(true);
    setError(null);

    try {
      // Generar sessionId si no existe
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(currentSessionId);
        localStorage.setItem("chatSessionId", currentSessionId);
      }

      const payload = {
        sessionId: currentSessionId,
        message: mensajeUsuario
      };
      
      console.log("Enviando mensaje:", mensajeUsuario);
      console.log("Con sessionId:", currentSessionId);
      
      const response = await axios.post(`${BASE_URL}api/chat-web/v1/chat`, payload);

      const data = response.data;
      console.log("Respuesta del backend:", data);
      console.log("SessionId recibido:", data.sessionId);
      
      const respuestaBot = data.respuesta || data.mensaje || data.reply || data.message || 
                           (typeof data === 'string' ? data : "Lo siento, no pude procesar tu mensaje.");
      const nuevaSesion = data.sessionId;

      // Actualizar sessionId si cambió o si es nuevo
      if (nuevaSesion) {
        setSessionId(nuevaSesion);
        localStorage.setItem("chatSessionId", nuevaSesion);
      }

      // Parsear opciones si la respuesta las contiene (formato numérico)
      let opciones = null;
      if (respuestaBot.includes("1️⃣") || respuestaBot.includes("2️⃣")) {
        // Detectar cuántas opciones hay
        const opcionesEncontradas = [];
        for (let i = 0; i <= 9; i++) {
          const emoji = `${i}️⃣`;
          if (respuestaBot.includes(emoji)) {
            opcionesEncontradas.push(i.toString());
          }
        }
        if (opcionesEncontradas.length > 0) {
          opciones = opcionesEncontradas;
        }
      }

      // Agregar respuesta del bot
      const mensajeBot = { 
        sender: "bot", 
        text: respuestaBot, 
        opciones: opciones,
        timestamp: new Date() 
      };
      
      setMensajes((prev) => [...prev, mensajeBot]);

      return respuestaBot;
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError(err);
      
      const mensajeError = { 
        sender: "bot", 
        text: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.", 
        timestamp: new Date() 
      };
      
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar conversación
  const reiniciarChat = () => {
    setMensajes([]);
    setSessionId(null);
    localStorage.removeItem("chatSessionId");
    iniciarConversacionAutomatica();
  };

  return {
    mensajes,
    sessionId,
    loading,
    error,
    enviarMensaje,
    reiniciarChat,
    iniciarConversacion,
  };
};

export default useCustomChat;
