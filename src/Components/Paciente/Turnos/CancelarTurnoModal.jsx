import React, { useState } from 'react'
import { cancelarTurnoPaciente } from '../../../Custom/Paciente/CustomPacienteVista'
import '../../../Css/Paciente/Turnos/CancelarTurnoModal.css'

const CancelarTurnoModal = ({ show, onHide, turno, idPaciente, onTurnoCancelado }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Función para manejar la cancelación
  const handleCancelar = async () => {
    if (!turno || !idPaciente) {
      setError('Datos del turno o paciente no disponibles')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Llamar a la función de cancelar turno
      const response = await cancelarTurnoPaciente(idPaciente, turno.idTurno)
      
      console.log('Turno cancelado exitosamente:', response)

      // Notificar al componente padre que el turno fue cancelado
      if (onTurnoCancelado) {
        onTurnoCancelado(turno.idTurno)
      }
      setTimeout(() => {
        onHide()
      }, 1500)

    } catch (err) {
      console.error('Error al cancelar turno:', err)
      setError(err.message || 'Error al cancelar el turno')
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible'
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (!show) return null

  return (
    <div className="modal fade show d-block modal-cancelar-overlay" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-cancelar">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              <span className="material-symbols-outlined me-2">cancel</span>
              <span className="d-none d-sm-inline">Cancelar Turno</span>
              <span className="d-inline d-sm-none">Cancelar</span>
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onHide}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body p-3 p-sm-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                <span className="material-symbols-outlined me-2 flex-shrink-0">error</span>
                <div className="small">{error}</div>
              </div>
            )}

            {loading && !error && (
              <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                <div className="spinner-border spinner-border-sm me-2 flex-shrink-0" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <div className="small">Cancelando turno...</div>
              </div>
            )}

            <div className="text-center mb-3 mb-sm-4">
              <div className="warning-icon-container mb-3">
                <span className="material-symbols-outlined warning-icon">
                  warning
                </span>
              </div>
              <h6 className="warning-title mb-2">¿Estás seguro que deseas cancelar este turno?</h6>
              <p className="warning-subtitle mb-0">Esta acción no se puede deshacer</p>
            </div>

            {turno && (
              <div className="turno-info-card">
                <div className="turno-info-header">
                  <h6 className="mb-0 d-flex align-items-center justify-content-center">
                    <span className="material-symbols-outlined me-2">event</span>
                    <span className="small">Información del Turno</span>
                  </h6>
                </div>
                
                <div className="card-body p-3">
                  <div className="row g-2 g-sm-3">
                    <div className="col-12 col-sm-6">
                      <div className="info-item d-flex align-items-start p-2 rounded">
                        <span className="material-symbols-outlined text-primary me-2 flex-shrink-0">calendar_today</span>
                        <div className="flex-grow-1">
                          <small className="info-label d-block">Fecha</small>
                          <strong className="info-value">{formatearFecha(turno.FechaSolicitudTurno)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="info-item d-flex align-items-start p-2 rounded">
                        <span className="material-symbols-outlined text-info me-2 flex-shrink-0">schedule</span>
                        <div className="flex-grow-1">
                          <small className="info-label d-block">Horario</small>
                          <strong className="info-value">{turno.HorarioRequeridoTurno || 'No asignado'}</strong>
                        </div>
                      </div>
                    </div>

                    {turno.NombreTratamiento && (
                      <div className="col-12">
                        <div className="info-item d-flex align-items-start p-2 rounded">
                          <span className="material-symbols-outlined text-success me-2 flex-shrink-0">medical_services</span>
                          <div className="flex-grow-1">
                            <small className="info-label d-block">Tratamiento</small>
                            <strong className="info-value">{turno.NombreTratamiento}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {turno.NombreEmpleado && (
                      <div className="col-12">
                        <div className="info-item d-flex align-items-start p-2 rounded">
                          <span className="material-symbols-outlined text-warning me-2 flex-shrink-0">person</span>
                          <div className="flex-grow-1">
                            <small className="info-label d-block">Profesional</small>
                            <strong className="info-value">{turno.NombreEmpleado}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="alert alert-warning d-flex align-items-start mt-3 mb-0 p-2 p-sm-3" role="alert">
              <span className="material-symbols-outlined me-2 mt-1 flex-shrink-0">info</span>
              <div className="small">
                <strong>Importante:</strong> Si cancelas este turno, deberás solicitar uno nuevo desde "Agendar Turno".
              </div>
            </div>
          </div>

          <div className="modal-footer d-flex flex-column flex-sm-row gap-2 p-3">
            <button 
              type="button" 
              className="btn btn-mantener d-flex align-items-center justify-content-center w-100 w-sm-auto order-2 order-sm-1"
              onClick={onHide}
              disabled={loading}
            >
              <span className="material-symbols-outlined me-2">close</span>
              <span className="d-none d-sm-inline">No, Mantener Turno</span>
              <span className="d-inline d-sm-none">Mantener</span>
            </button>
            <button 
              type="button" 
              className="btn btn-cancelar-turno d-flex align-items-center justify-content-center w-100 w-sm-auto order-1 order-sm-2"
              onClick={handleCancelar}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  Cancelando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined me-2">cancel</span>
                  <span className="d-none d-sm-inline">Sí, Cancelar Turno</span>
                  <span className="d-inline d-sm-none">Cancelar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelarTurnoModal