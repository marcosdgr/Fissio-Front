import React, { useEffect, useState, useRef, useCallback } from 'react';
import useCustomMensajeria from '../../Custom/MensajeriaInterna/useCustomMensajeriaInterna';
import { useAuthStore } from '../../Store/useAuthStore';
import '../../Css/mensajeriainterna/MensajeriaInterna.css';

const MensajeriaInterna = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoActual, setEmpleadoActual] = useState(null); 
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [conversacion, setConversacion] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({}); 
  const [vistaActual, setVistaActual] = useState('inbox'); 
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState([]); 

  const authUser = useAuthStore(state => state.user);
  const mensajesApi = useCustomMensajeria;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUnreadCounts = useCallback(async (empleadosList, empActual) => {
    if (!empActual) return;

    const counts = {};
    const allUnreadMessages = [];
    
    for (const emp of empleadosList) {
      if (emp.idEmpleado === empActual.idEmpleado) continue; 
      
      try {
        const conv = await mensajesApi.getConversation(empActual.idUsuario, emp.idUsuario);
        
        if (conv) {
          const unreadMessages = conv.filter(m => !m.Leido && m.idEmpleadoDestinatario === empActual.idEmpleado);
          counts[emp.idEmpleado] = unreadMessages.length;
          
          // Agregar info del remitente a cada mensaje no leído
          unreadMessages.forEach(msg => {
            allUnreadMessages.push({
              ...msg,
              remitenteInfo: emp 
            });
          });
        }
      } catch (err) {
        console.error(`Error cargando mensajes de empleado ${emp.idEmpleado}`, err);
      }
    }

    allUnreadMessages.sort((a, b) => new Date(b.FechaEnvio) - new Date(a.FechaEnvio));
    
    setUnreadCounts(counts);
    setMensajesNoLeidos(allUnreadMessages);
  }, [mensajesApi]);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await mensajesApi.getActiveEmployees();
        setEmpleados(data || []);

        const idUsuarioLogueado = authUser?.usuario?.idUsuario || authUser?.idUsuario;
        
        const empActual = data.find(e => e.idUsuario === idUsuarioLogueado);
        
        if (empActual) {
          setEmpleadoActual(empActual);

          await loadUnreadCounts(data, empActual);
        } else {
          console.error(' No se encontró el empleado actual en la lista de empleados');
          console.error('Buscando idUsuario:', idUsuarioLogueado, 'en lista:', data.map(e => e.idUsuario));
        }
      } catch (err) {
        console.error('Error al obtener empleados activos', err);
      }
    };
    init();
  }, [authUser, mensajesApi, loadUnreadCounts]);

  useEffect(() => {
    scrollToBottom();
  }, [conversacion]);

  const handleSelectEmpleado = async (emp) => {;    
    if (!empleadoActual) {
      console.error(' No se encontró información del empleado actual');
      return;
    }

    setSelectedEmpleado(emp);
    setVistaActual('chat'); 
    setLoading(true);
    try {
      const conv = await mensajesApi.getConversation(empleadoActual.idUsuario, emp.idUsuario);
      setConversacion(conv || []);
      const mensajesParaMarcar = (conv || []).filter(
        m => {
          const esNoLeido = !m.Leido || m.Leido === 0 || m.Leido === false;
          const esMiMensaje = m.idEmpleadoDestinatario === empleadoActual.idEmpleado;
          return esNoLeido && esMiMensaje;
        }
      );
 
      for (const m of mensajesParaMarcar) {
        try {
          const response = await mensajesApi.markAsRead(m.idNotificacion, empleadoActual.idEmpleado);
          console.log(` Respuesta del servidor:`, response);
          m.Leido = 1;
        } catch (err) {
          console.error(`Error marcando mensaje ${m.idNotificacion} como leido:`, err);
          console.error('Detalles del error:', err.response?.data);
        }
      }
      
      if (mensajesParaMarcar.length > 0) {
        setConversacion([...(conv || [])]);
      }

      setUnreadCounts(prev => ({
        ...prev,
        [emp.idEmpleado]: 0
      }));
      await loadUnreadCounts(empleados, empleadoActual);
    } catch (err) {
      console.error('Error al obtener conversacion', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVolverInbox = () => {
    setVistaActual('inbox');
    setSelectedEmpleado(null);
    setConversacion([]);
  };
  
  const handleClickMensajeNoLeido = async (mensaje) => {
    const empleadoRemitente = empleados.find(e => e.idUsuario === mensaje.idRemitente);
    if (empleadoRemitente) {
      await handleSelectEmpleado(empleadoRemitente);
    }
  };

  const handleSend = async () => {
    if (!mensaje.trim()) {
      console.warn('Mensaje vacío');
      return;
    }
    if (!selectedEmpleado) {
      console.warn('No hay empleado seleccionado');
      return;
    }
    if (!empleadoActual) {
      console.warn('No hay empleado actual');
      return;
    }
    
    try {
      // destinatarios son idEmpleado
      const destinatarios = [selectedEmpleado.idEmpleado];
      
      await mensajesApi.sendMessage(mensaje.trim(), destinatarios);
      
      setMensaje('');

      // refrescar conversacion
      await handleSelectEmpleado(selectedEmpleado);
      
      // Recargar contadores de no leídos para todos los empleados
      await loadUnreadCounts(empleados, empleadoActual);
    } catch (err) {
      console.error('Error enviando mensaje', err);
      console.error('Detalles del error:', err.response?.data);
    }
  };

  return (
    <div className="mensajeria-container">
      <aside className="mensajeria-sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">
            <span className="icon-inbox">📬</span>
            Mensajería Interna
          </h5>
          <span className="badge-count">{empleados.length} empleados</span>
        </div>
        
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Buscar empleado..." className="search-input" />
        </div>

        <ul className="empleados-list">
          {empleados
            .filter(emp => emp.idEmpleado !== empleadoActual?.idEmpleado)
            .map(emp => {
              const isSelected = selectedEmpleado?.idEmpleado === emp.idEmpleado;
              const unreadCount = unreadCounts[emp.idEmpleado] || 0;
              
              return (
                <li 
                  key={emp.idEmpleado} 
                  className={`empleado-item ${isSelected ? 'selected' : ''}`} 
                  onClick={() => handleSelectEmpleado(emp)}
                >
                  <div className="empleado-avatar">
                    {emp.NombreEmpleado?.[0]}{emp.ApellidoEmpleado?.[0]}
                  </div>
                  <div className="empleado-info">
                    <div className="empleado-name">
                      {emp.NombreEmpleado} {emp.ApellidoEmpleado}
                      {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                      )}
                    </div>
                    <div className="empleado-mail">{emp.MailUsuario}</div>
                  </div>
                </li>
              );
            })}
        </ul>
      </aside>

      <main className="mensajeria-main">
        {vistaActual === 'inbox' ? (
          <div className="inbox-view">
            <div className="inbox-header">
              <h3 className="inbox-title">
                <span className="inbox-icon">📬</span>
                Bandeja de Entrada
              </h3>
              <span className="inbox-count">
                {mensajesNoLeidos.length} mensaje{mensajesNoLeidos.length !== 1 ? 's' : ''} sin leer
              </span>
            </div>

            <div className="inbox-content">
              {mensajesNoLeidos.length === 0 ? (
                <div className="inbox-empty">
                  <div className="empty-icon">✉️</div>
                  <h4>¡Todo al día!</h4>
                  <p>No tienes mensajes pendientes por leer</p>
                </div>
              ) : (
                <div className="inbox-messages">
                  {mensajesNoLeidos.map((msg) => (
                    <div 
                      key={`${msg.idNotificacion}-${msg.idEmpleadoDestinatario}`}
                      className="inbox-message-card"
                      onClick={() => handleClickMensajeNoLeido(msg)}
                    >
                      <div className="inbox-card-avatar">
                        {msg.remitenteInfo?.NombreEmpleado?.[0]}
                        {msg.remitenteInfo?.ApellidoEmpleado?.[0]}
                      </div>
                      <div className="inbox-card-content">
                        <div className="inbox-card-header">
                          <span className="inbox-card-name">
                            {msg.remitenteInfo?.NombreEmpleado} {msg.remitenteInfo?.ApellidoEmpleado}
                          </span>
                          <span className="inbox-card-time">
                            {new Date(msg.FechaEnvio).toLocaleString('es-AR', { 
                              day: '2-digit', 
                              month: '2-digit',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="inbox-card-message">
                          {msg.Mensaje}
                        </div>
                        <div className="inbox-card-footer">
                          <span className="inbox-card-badge">Nuevo</span>
                          <span className="inbox-card-mail">{msg.remitenteInfo?.MailUsuario}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="conversation">
            <div className="conversation-header">
              <div className="header-left">
                <button 
                  className="btn-back-inbox" 
                  onClick={handleVolverInbox}
                  title="Volver a Bandeja de Entrada"
                >
                  ← Bandeja de Entrada
                </button>
                <div className="header-avatar">
                  {selectedEmpleado?.NombreEmpleado?.[0]}{selectedEmpleado?.ApellidoEmpleado?.[0]}
                </div>
                <div className="header-info">
                  <h6 className="header-name">{selectedEmpleado?.NombreEmpleado} {selectedEmpleado?.ApellidoEmpleado}</h6>
                </div>
              </div>
              <div className="header-actions">
                <button className="icon-button" title="Actualizar" onClick={() => handleSelectEmpleado(selectedEmpleado)}>🔄</button>
              </div>
            </div>

            <div className="messages-area">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando mensajes...</p>
                </div>
              ) : conversacion.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <p>No hay mensajes aún</p>
                  <span className="empty-hint">Inicia la conversación</span>
                </div>
              ) : (
                conversacion.map(m => {
                  const isOutgoing = empleadoActual && m.idRemitente === empleadoActual.idUsuario;
                  const leido = m.Leido === 1 || m.Leido === true;
                  
                  return (
                    <div key={`${m.idNotificacion}-${m.idEmpleadoDestinatario}`} className={`message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                      <div className="message-bubble">
                        <div className="message-body">{m.Mensaje}</div>
                        <div className="message-meta">
                          <span className="message-time">{new Date(m.FechaEnvio).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                          {!leido && !isOutgoing && <span className="badge-new">Nuevo</span>}
                          {isOutgoing && (
                            <span className="message-status" title={leido ? 'Leído' : 'Enviado'}>
                              {leido ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="composer">
              <textarea 
                value={mensaje} 
                onChange={(e) => setMensaje(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribe un mensaje..."
                className="composer-textarea"
              ></textarea>
              <button className="btn-send" onClick={handleSend} disabled={!mensaje.trim()}>
                <span className="send-icon">📤</span>
                Enviar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MensajeriaInterna;
