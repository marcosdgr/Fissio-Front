import React, { useEffect, useState, useRef, useCallback } from 'react';
import useCustomMensajeria from '../../Custom/MensajeriaInterna/useCustomMensajeriaInterna';
import { useAuthStore } from '../../Store/useAuthStore';
import '../../Css/mensajeriainterna/MensajeriaInterna.css';

const MensajeriaInterna = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [conversacion, setConversacion] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({}); // { idEmpleado: count }

  const authUser = useAuthStore(state => state.user);
  const mensajesApi = useCustomMensajeria;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUnreadCounts = useCallback(async (empleadosList) => {
    const idUsuarioActual = authUser?.usuario?.idUsuario || authUser?.idUsuario;
    if (!idUsuarioActual) return;

    const counts = {};
    
    for (const emp of empleadosList) {
      try {
        const conv = await mensajesApi.getConversation(idUsuarioActual, emp.idUsuario);
        const empleadoActual = empleadosList.find(e => e.idUsuario === idUsuarioActual);
        const idEmpleadoActual = empleadoActual?.idEmpleado;
        
        if (idEmpleadoActual && conv) {
          const unreadMessages = conv.filter(m => !m.Leido && m.idEmpleadoDestinatario === idEmpleadoActual);
          counts[emp.idEmpleado] = unreadMessages.length;
        }
      } catch (err) {
        console.error(`Error cargando mensajes de empleado ${emp.idEmpleado}`, err);
      }
    }
    
    setUnreadCounts(counts);
  }, [authUser, mensajesApi]);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await mensajesApi.getActiveEmployees();
        setEmpleados(data || []);
        
        // Obtener mensajes no leídos para cada empleado
        await loadUnreadCounts(data);
      } catch (err) {
        console.error('Error al obtener empleados activos', err);
      }
    };
    init();
  }, [mensajesApi, loadUnreadCounts]);

  useEffect(() => {
    scrollToBottom();
  }, [conversacion]);

  const handleSelectEmpleado = async (emp) => {
    setSelectedEmpleado(emp);
    setLoading(true);
    try {
      const idUsuarioActual = authUser?.usuario?.idUsuario || authUser?.idUsuario || authUser?.MailUsuario ? (authUser?.usuario?.idUsuario || authUser?.idUsuario) : null;
      const idUsuarioDestino = emp.idUsuario;
      if (!idUsuarioActual) {
        // intentar obtener idUsuario del objeto user
        console.warn('No se encontró idUsuario en el store. Revisa login.');
      }
      const conv = await mensajesApi.getConversation(idUsuarioActual, idUsuarioDestino);
      setConversacion(conv || []);

      // marcar como leidos si corresponde: buscar mensajes no leidos donde idEmpleadoDestinatario === idEmpleadoActual
      const empleadoActual = empleados.find(e => e.idUsuario === idUsuarioActual);
      const idEmpleadoActual = empleadoActual?.idEmpleado;
      if (idEmpleadoActual) {
        const mensajesParaMarcar = (conv || []).filter(m => !m.Leido && m.idEmpleadoDestinatario === idEmpleadoActual);
        for (const m of mensajesParaMarcar) {
          try {
            await mensajesApi.markAsRead(m.idNotificacion, idEmpleadoActual);
            // actualizar estado local
            m.Leido = 1;
          } catch (err) {
            console.error('Error marcando como leido', err);
          }
        }
        setConversacion([... (conv || [])]);
        
        // Actualizar contador de no leídos para este empleado
        setUnreadCounts(prev => ({
          ...prev,
          [emp.idEmpleado]: 0
        }));
      }
    } catch (err) {
      console.error('Error al obtener conversacion', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!mensaje.trim() || !selectedEmpleado) return;
    try {
      // destinatarios son idEmpleado (la API espera ids de empleados)
      const destinatarios = [selectedEmpleado.idEmpleado];
      await mensajesApi.sendMessage(mensaje.trim(), destinatarios);
      setMensaje('');

      // refrescar conversacion
      await handleSelectEmpleado(selectedEmpleado);
      
      // Recargar contadores de no leídos para todos los empleados
      await loadUnreadCounts(empleados);
    } catch (err) {
      console.error('Error enviando mensaje', err);
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
          {empleados.map(emp => {
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
                <div className="empleado-status">
                  <span className="status-dot"></span>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="mensajeria-main">
        {!selectedEmpleado ? (
          <div className="placeholder-content">
            <div className="placeholder-icon">📧</div>
            <h3 className="placeholder-title">Bandeja de entrada</h3>
            <p className="placeholder-text">Selecciona un empleado de la lista para ver la conversación</p>
          </div>
        ) : (
          <div className="conversation">
            <div className="conversation-header">
              <div className="header-left">
                <div className="header-avatar">
                  {selectedEmpleado.NombreEmpleado?.[0]}{selectedEmpleado.ApellidoEmpleado?.[0]}
                </div>
                <div className="header-info">
                  <h6 className="header-name">{selectedEmpleado.NombreEmpleado} {selectedEmpleado.ApellidoEmpleado}</h6>
                  <span className="header-status">● En línea</span>
                </div>
              </div>
              <div className="header-actions">
                <button className="icon-button" title="Actualizar">🔄</button>
                <button className="icon-button" title="Información">ℹ️</button>
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
                  const isOutgoing = m.idRemitente === (authUser?.usuario?.idUsuario || authUser?.idUsuario);
                  return (
                    <div key={`${m.idNotificacion}-${m.idEmpleadoDestinatario}`} className={`message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                      <div className="message-bubble">
                        <div className="message-body">{m.Mensaje}</div>
                        <div className="message-meta">
                          <span className="message-time">{new Date(m.FechaEnvio).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                          {!m.Leido && !isOutgoing && <span className="badge-new">Nuevo</span>}
                          {isOutgoing && <span className="message-status">{m.Leido ? '✓✓' : '✓'}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="composer">
              <button className="composer-icon-btn" title="Adjuntar archivo">📎</button>
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
