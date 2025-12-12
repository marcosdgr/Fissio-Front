import React, { useState, useRef, useEffect } from 'react';
import useCustomChat from '../../Custom/BOT/useCustomChat';
import '../../Css/bot/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatBodyRef = useRef(null);
  
  const { mensajes, loading, enviarMensaje, reiniciarChat } = useCustomChat();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    try {
      await enviarMensaje(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const handleOptionClick = async (opcion) => {
    try {
      await enviarMensaje(opcion);
    } catch (error) {
      console.error('Error al enviar opción:', error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleReiniciar = () => {
    reiniciarChat();
  };

  return (
    <>

      <button
        className="chat-toggle"
        onClick={toggleChat}
        title={isOpen ? 'Cerrar chat' : 'Abrir chat de ayuda'}
      >
        {isOpen ? (
          <span className="material-symbols-outlined">close</span>
        ) : (
          <span className="material-symbols-outlined">chat</span>
        )}
      </button>


      {isOpen && (
        <div className="chat-box">

          <div className="chat-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="material-symbols-outlined me-2">support_agent</span>
                <div>
                  <h6 className="mb-0 fw-bold">Asistente Fissio</h6>
                  <small className="chat-status">
                    {loading ? 'Escribiendo...' : 'En línea'}
                  </small>
                </div>
              </div>
              <button 
                className="btn-reiniciar"
                onClick={handleReiniciar}
                title="Reiniciar conversación"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {mensajes.length === 0 ? (
              <div className="chat-empty">
                <span className="material-symbols-outlined">chat_bubble_outline</span>
                <p>Iniciando conversación...</p>
              </div>
            ) : (
              mensajes.map((mensaje, index) => (
                <div key={index}>
                  <div className={`message ${mensaje.sender === 'usuario' ? 'user' : 'bot'}`}>
                    <div className="message-content">
                      {mensaje.text}
                    </div>
                    {mensaje.timestamp && (
                      <div className="message-time">
                        {new Date(mensaje.timestamp).toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>

                  {mensaje.opciones && mensaje.opciones.length > 0 && (
                    <div className="message-options">
                      {mensaje.opciones.map((opcion, idx) => (
                        <button
                          key={idx}
                          className="option-button"
                          onClick={() => handleOptionClick(opcion)}
                          disabled={loading}
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button 
              type="submit" 
              disabled={loading || !inputMessage.trim()}
              title="Enviar mensaje"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
