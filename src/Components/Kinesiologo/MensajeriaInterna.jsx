import React, { useState, useEffect } from 'react';
import { getConversation, sendMessage, getActiveEmployees } from '../../../Custom/CustomMensajeriaKine';
import { showSuccess, showError } from '../../../Utils/sweetAlerts';

const MensajeriaInterna = () => {
  const [conversaciones, setConversaciones] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  // ID del kinesiólogo (fíjalo o pásalo por contexto)
  const idKinesiologo = 5; // Cambiar por login real

  const cargarEmpleados = async () => {
    try {
      const data = await getActiveEmployees();
      setEmpleados(data.filter(e => e.idEmpleado !== idKinesiologo));
    } catch (err) {
      showError('Error', 'No se pudieron cargar empleados');
    }
  };

  const cargarMensajes = async (idDestinatario) => {
    setLoading(true);
    try {
      const data = await getConversation(idKinesiologo, idDestinatario);
      setMensajes(data.mensajes || []);
    } catch (err) {
      showError('Error', 'No se pudo cargar la conversación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim() || !empleadoSeleccionado) return;

    try {
      await sendMessage(nuevoMensaje, [empleadoSeleccionado]);
      setNuevoMensaje('');
      cargarMensajes(empleadoSeleccionado);
      showSuccess('Enviado', 'Mensaje enviado');
    } catch (err) {
      showError('Error', 'No se pudo enviar');
    }
  };

  return (
    <div className="row h-100">
      <div className="col-md-4 border-end">
        <h6>Empleados</h6>
        <div className="list-group">
          {empleados.map(emp => (
            <button
              key={emp.idEmpleado}
              className={`list-group-item list-group-item-action ${empleadoSeleccionado === emp.idEmpleado ? 'active' : ''}`}
              onClick={() => {
                setEmpleadoSeleccionado(emp.idEmpleado);
                cargarMensajes(emp.idEmpleado);
              }}
            >
              {emp.Nombre} {emp.Apellido}
            </button>
          ))}
        </div>
      </div>

      <div className="col-md-8 d-flex flex-column">
        {empleadoSeleccionado ? (
          <>
            <div className="border-bottom p-2">
              <strong>Chat con: {empleados.find(e => e.idEmpleado === empleadoSeleccionado)?.Nombre}</strong>
            </div>
            <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '50vh' }}>
              {loading ? (
                <p>Cargando...</p>
              ) : mensajes.length === 0 ? (
                <p className="text-muted">No hay mensajes aún</p>
              ) : (
                mensajes.map((msg, i) => (
                  <div key={i} className={`d-flex mb-2 ${msg.idRemitente === idKinesiologo ? 'justify-content-end' : ''}`}>
                    <div
                      className={`p-2 rounded ${msg.idRemitente === idKinesiologo ? 'bg-primary text-white' : 'bg-light'}`}
                      style={{ maxWidth: '70%' }}
                    >
                      <small>{msg.mensaje}</small>
                      <small className="d-block text-end opacity-75">
                        {new Date(msg.fecha).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="input-group p-3">
              <input
                type="text"
                className="form-control"
                placeholder="Escribir mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
              />
              <button className="btn btn-primary" onClick={handleEnviar}>Enviar</button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-5">Selecciona un empleado para chatear</p>
        )}
      </div>
    </div>
  );
};

export default MensajeriaInterna;