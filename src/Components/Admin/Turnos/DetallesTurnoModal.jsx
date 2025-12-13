import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const DetallesTurnoModal = ({ isOpen, onClose, turno }) => {
  const [detalles, setDetalles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !turno) {
      return;
    }

    // Usar directamente los datos del turno que se pasa como prop
    setIsLoading(true);
    console.log('DetallesTurnoModal recibió turno:', turno);
    console.log('Todos los campos del turno:', Object.keys(turno));
    console.log('ObservacionesFinal:', turno.ObservacionesFinal);
    console.log('observacionesFinal:', turno.observacionesFinal);
    console.log('Informe:', turno.Informe);
    console.log('informe:', turno.informe);
    setTimeout(() => {
      setDetalles(turno);
      setIsLoading(false);
    }, 100);
  }, [isOpen, turno]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">info</span>
              Detalles del Turno
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando detalles del turno...</p>
              </div>
            ) : detalles ? (
              <div className="row">
                {/* Información del Paciente */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">person</span>
                        Información del Paciente
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Nombre Completo:</strong>
                        <br />
                        {detalles.NombrePaciente} {detalles.ApellidoPaciente || ''}
                      </div>
                      
                      {detalles.DniPaciente && (
                        <div className="mb-3">
                          <strong>DNI:</strong>
                          <br />
                          <span className="badge bg-secondary">{detalles.DniPaciente}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalles del Turno */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">schedule</span>
                        Detalles del Turno
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Tratamiento:</strong>
                        <br />
                        {detalles.NombreTratamiento || 'No especificado'}
                      </div>
                      <div className="mb-3">
                        <strong>Fecha:</strong>
                        <br />
                        {formatearFecha(detalles.FechaRequeridaTurno)}
                      </div>
                      <div className="mb-3">
                        <strong>Hora:</strong>
                        <br />
                        {detalles.HorarioRequeridoTurno || 'No especificada'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informe de la Sesión */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">note_add</span>
                        Informe de la Sesión
                      </h6>
                    </div>
                    <div className="card-body">
                      {detalles.InformeTurno || detalles.ObservacionesFinal || detalles.observacionesFinal ? (
                        <div>
                          <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                            {detalles.InformeTurno || detalles.ObservacionesFinal || detalles.observacionesFinal}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1">info</span>
                          No hay informe disponible para este turno.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-muted" style={{ fontSize: '3rem' }}>
                  error_outline
                </span>
                <p className="mt-2 text-muted">No se pudieron cargar los detalles del turno</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <span className="material-symbols-outlined me-1">close</span>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesTurnoModal;