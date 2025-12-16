import React, { useState, useEffect } from 'react';
import { obtenerDetallesTurno } from '../../../Custom/CustomTurnos';
import Swal from 'sweetalert2';

const DetallesTurnoModal = ({ isOpen, onClose, turno }) => {
  const [detalles, setDetalles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !turno || (!turno.idTurno && !turno.IdTurno)) {
      return;
    }

    const cargarDetalles = async () => {
      setIsLoading(true);
      try {
        const idTurno = turno.IdTurno || turno.idTurno;
        const response = await obtenerDetallesTurno(idTurno);
        setDetalles(response.turno);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            'No se pudieron cargar los detalles del turno';
        
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar detalles',
          text: errorMessage,
          confirmButtonColor: '#0470BB',
          footer: error.response?.status ? `Código de error: ${error.response.status}` : null
        });
      } finally {
        setIsLoading(false);
      }
    };

    cargarDetalles();
  }, [isOpen, turno]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Solicitado': 'bg-warning text-dark',
      'En Curso': 'bg-primary',
      'Finalizado': 'bg-success',
      'Cancelado': 'bg-danger',
      'Pendiente': 'bg-info'
    };
    return badges[estado] || 'bg-secondary';
  };

  const descargarOrdenMedica = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">person</span>
                        Información del Paciente
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Nombre Completo:</strong>
                        <br />
                        {detalles.nombre} {detalles.apellido}
                      </div>
                      
                      <div className="mb-3">
                        <strong>DNI:</strong>
                        <br />
                        <span className="badge bg-secondary">{detalles.dni}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">schedule</span>
                        Estado del Turno
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Estado Actual:</strong>
                        <br />
                        <span className={`badge ${getEstadoBadge(detalles.estado)} mt-1`}>
                          {detalles.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Observaciones de Secretaría */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">assignment</span>
                        Observaciones de Secretaría
                      </h6>
                    </div>
                    <div className="card-body">
                      {detalles.observacionesSecretaria ? (
                        <div className="alert alert-secondary mb-0">
                          {detalles.observacionesSecretaria}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>info</span>
                          La secretaría no agregó observaciones.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Observaciones Finales del Kinesiólogo */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">note_add</span>
                        Observaciones Finales (Kinesiólogo)
                      </h6>
                    </div>
                    <div className="card-body">
                      {detalles.ObservacionesFinal ? (
                        <div className="alert alert-info mb-0">
                          {detalles.ObservacionesFinal}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>info</span>
                          El turno aún no ha sido finalizado por el kinesiólogo.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {detalles.ordenMedica && (
                  <div className="col-12 mt-3">
                    <div className="card">
                      <div className="card-header bg-primary">
                        <h6 className="mb-0">
                          <span className="material-symbols-outlined me-1">description</span>
                          Orden Médica
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-2">
                              <strong>Descripción:</strong>
                              <br />
                              {detalles.ordenMedica.descripcion}
                            </div>
                            
                            <div className="mb-2">
                              <strong>Fecha de Subida:</strong>
                              <br />
                              {formatearFecha(detalles.ordenMedica.fechaSubida)}
                            </div>
                          </div>
                          
                          <div className="col-md-4 text-end">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => descargarOrdenMedica(detalles.ordenMedica.url)}
                            >
                              <span className="material-symbols-outlined me-1">open_in_new</span>
                              Ver Orden Médica
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!detalles.ordenMedica && (
                  <div className="col-12 mt-3">
                    <div className="card">
                      <div className="card-header bg-primary">
                        <h6 className="mb-0">
                          <span className="material-symbols-outlined me-1">description</span>
                          Orden Médica
                        </h6>
                      </div>
                      <div className="card-body">
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1">info</span>
                          No se encontró orden médica asociada a este turno.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tratamiento Asignado */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">healing</span>
                        Tratamiento Asignado
                      </h6>
                    </div>
                    <div className="card-body">
                      {detalles.tratamiento ? (
                        <div>
                          <div className="mb-2">
                            <strong>Nombre:</strong>
                            <br />
                            <span className="badge bg-info text-dark mt-1">
                              {detalles.tratamiento.nombre}
                            </span>
                          </div>
                          
                          {detalles.tratamiento.descripcion && (
                            <div>
                              <strong>Descripción:</strong>
                              <br />
                              <div className="alert alert-light mb-0 mt-1">
                                {detalles.tratamiento.descripcion}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>info</span>
                          No se ha asignado un tratamiento a este turno.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Servicio Asignado */}
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-header bg-primary">
                      <h6 className="mb-0">
                        <span className="material-symbols-outlined me-1">medical_services</span>
                        Servicio Asignado
                      </h6>
                    </div>
                    <div className="card-body">
                      {detalles.servicio ? (
                        <div>
                          <div className="mb-2">
                            <strong>Nombre:</strong>
                            <br />
                            <span className="badge bg-success mt-1">
                              {detalles.servicio.nombre}
                            </span>
                          </div>
                          
                          {detalles.servicio.descripcion && (
                            <div>
                              <strong>Descripción:</strong>
                              <br />
                              <div className="alert alert-light mb-0 mt-1">
                                {detalles.servicio.descripcion}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          <span className="material-symbols-outlined me-1" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>info</span>
                          No se ha asignado un servicio a este turno.
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