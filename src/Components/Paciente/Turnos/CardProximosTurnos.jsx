import React, { useState } from 'react'

const CardProximosTurnos = ({ turnosDetalles, loading, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Obtener turnos próximos (Solicitados y Pendientes) con detalles
  const obtenerTurnosProximos = () => {
    if (!turnosDetalles) return []
    return turnosDetalles
      .filter(turno => {
        const estadoNormalizado = turno.EstadoTurno?.toString().trim().toLowerCase()
        return estadoNormalizado === 'solicitado' || estadoNormalizado === 'pendiente'
      })
  }

  // Obtener turnos a mostrar
  const turnosProximos = obtenerTurnosProximos()
  const turnoActual = turnosProximos[currentIndex]

  // Navegación del carrusel
  const handlePrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : turnosProximos.length - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev < turnosProximos.length - 1 ? prev + 1 : 0))
  }

  // Ir a un turno específico
  const goToSlide = (e, index) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  // Calcular total de turnos próximos
  const calcularTurnosProximos = () => {
    if (!turnosDetalles) return 0
    return turnosDetalles.filter(turno => {
      const estadoNormalizado = turno.EstadoTurno?.toString().trim().toLowerCase()
      return estadoNormalizado === 'solicitado' || estadoNormalizado === 'pendiente'
    }).length
  }

  // Formatear fecha de turno
  const formatearFechaTurno = (fecha) => {
    if (!fecha) return 'Sin fecha'
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    const estadoNormalizado = estado?.toString().trim().toLowerCase()
    const clases = {
      'solicitado': 'bg-info',
      'pendiente': 'bg-warning text-dark',
      'finalizado': 'bg-success',
      'cancelado': 'bg-danger'
    }
    return clases[estadoNormalizado] || 'bg-secondary'
  }

  // Normalizar estado para mostrar
  const normalizarEstado = (estado) => {
    if (!estado) return ''
    const estadoNormalizado = estado.toString().trim().toLowerCase()
    const map = {
      'solicitado': 'Solicitado',
      'pendiente': 'Pendiente',
      'finalizado': 'Finalizado',
      'cancelado': 'Cancelado'
    }
    return map[estadoNormalizado] || estado
  }

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
      <div 
        className="perfil-nav-card h-100" 
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="card-icon">
          <span className="material-symbols-outlined">event_available</span>
        </div>
        <h5 className="card-title">Próximos Turnos</h5>
        
        {/* Lista de próximos turnos - Carrusel */}
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : turnosProximos.length > 0 && turnoActual ? (
          <div className="mb-3">
            {/* Turno actual */}
            <div className="bg-light rounded p-2 p-sm-3 border border-1 position-relative">
              <div className="row g-2">
                <div className="col-12">
                  <div className="d-flex align-items-center flex-wrap mb-2 gap-2">
                    <span className="material-symbols-outlined text-primary me-1" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                      calendar_today
                    </span>
                    <strong className="flex-grow-1 small">{formatearFechaTurno(turnoActual.FechaRequeridaTurno)}</strong>
                    <span className={`badge ${getBadgeClass(turnoActual.EstadoTurno)} flex-shrink-0`}>
                      <small style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>{normalizarEstado(turnoActual.EstadoTurno)}</small>
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <span className="material-symbols-outlined text-info me-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                      schedule
                    </span>
                    <span className="small">{turnoActual.HorarioRequeridoTurno || 'Sin horario asignado'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de navegación - Solo si hay más de 1 turno */}
            {turnosProximos.length > 1 && (
              <div className="mt-2 mt-sm-3">
                <div className="d-flex align-items-center justify-content-between px-1">
                  {/* Botón Anterior */}
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center p-1"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                    onClick={handlePrevious}
                    aria-label="Turno anterior"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_left</span>
                  </button>

                  {/* Indicadores de paginación */}
                  <div className="d-flex gap-1 gap-sm-2 align-items-center flex-wrap justify-content-center">
                    {turnosProximos.map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm rounded-circle p-0 ${
                          index === currentIndex ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        style={{ width: '8px', height: '8px', minWidth: '8px' }}
                        onClick={(e) => goToSlide(e, index)}
                        aria-label={`Ir al turno ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Botón Siguiente */}
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center p-1"
                    style={{ minWidth: '32px', minHeight: '32px' }}
                    onClick={handleNext}
                    aria-label="Turno siguiente"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_right</span>
                  </button>
                </div>

                {/* Contador de turnos */}
                <div className="text-center mt-1 mt-sm-2">
                  <small className="text-muted" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
                    Turno {currentIndex + 1} de {turnosProximos.length}
                  </small>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="card-description text-muted small mb-3">
            No tienes turnos próximos programados
          </p>
        )}
        
        <div className="card-stats mt-auto">
          <div>
            <div className="stats-number">
              {loading ? '...' : calcularTurnosProximos()}
            </div>
            <div className="stats-label">Total Próximos</div>
          </div>
          <span className="material-symbols-outlined text-primary">
            arrow_forward
          </span>
        </div>
      </div>
    </div>
  )
}

export default CardProximosTurnos
