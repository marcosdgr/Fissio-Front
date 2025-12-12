import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerTurnosPorPaciente } from '../../../Custom/Paciente/CustomPacienteVista'
import CancelarTurnoModal from './CancelarTurnoModal'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'
import '../../../Css/Paciente/Turnos/HistorialTurnos.css'

const HistorialTurnos = () => {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [turnosFiltrados, setTurnosFiltrados] = useState([])
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [showModal, setShowModal] = useState(false)
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const turnosPorPagina = 4

  const { user } = useAuthStore()
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente || user?.idPaciente || user?.usuario?.idPaciente || user?.idUsuario

  const cargarTurnos = async () => {
    if (!idPaciente) {
      setError('No se encontró la información del paciente')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await obtenerTurnosPorPaciente(idPaciente)
      
      console.log('Turnos obtenidos del backend:', data)

      const turnosOrdenados = data.sort((a, b) => {
        return new Date(b.FechaSolicitudTurno) - new Date(a.FechaSolicitudTurno)
      })
      
      setTurnos(turnosOrdenados)
      
      if (turnosOrdenados.length === 0) {
        console.warn('No se encontraron turnos para el paciente. Verifica que el backend use LEFT JOIN en la query de tratamientos.')
      }
    } catch (err) {
      console.error('Error al cargar turnos:', err)
      setError(err.response?.data?.message || 'Error al cargar el historial de turnos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTurnos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPaciente])

  useEffect(() => {
    if (filtroEstado === 'Todos') {
      setTurnosFiltrados(turnos)
    } else {
      setTurnosFiltrados(turnos.filter(turno => turno.EstadoTurno === filtroEstado))
    }

    setPaginaActual(1)
  }, [filtroEstado, turnos])

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible'
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Confirmado':
        return 'bg-success'
      case 'Solicitado':
        return 'bg-warning text-dark'
      case 'Cancelado':
        return 'bg-danger'
      case 'Finalizado':
        return 'bg-secondary'
      case 'En proceso':
        return 'bg-info'
      default:
        return 'bg-secondary'
    }
  }

  const handleCancelarClick = (turno) => {
    setTurnoSeleccionado(turno)
    setShowModal(true)
  }

  const handleTurnoCancelado = (idTurno) => {
    setTurnos(prevTurnos => 
      prevTurnos.map(turno => 
        turno.idTurno === idTurno 
          ? { ...turno, EstadoTurno: 'Cancelado' }
          : turno
      )
    )
    setShowModal(false)
  }

  const puedeCancelar = (estado) => {
    return estado !== 'Finalizado' && estado !== 'Cancelado'
  }

  const indexUltimoTurno = paginaActual * turnosPorPagina
  const indexPrimerTurno = indexUltimoTurno - turnosPorPagina
  const turnosPaginados = turnosFiltrados.slice(indexPrimerTurno, indexUltimoTurno)
  const totalPaginas = Math.ceil(turnosFiltrados.length / turnosPorPagina)

  const irAPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      irAPagina(paginaActual - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      irAPagina(paginaActual + 1)
    }
  }

  const estadisticas = {
    total: turnos.length,
    confirmados: turnos.filter(t => t.EstadoTurno === 'Confirmado').length,
    solicitados: turnos.filter(t => t.EstadoTurno === 'Solicitado').length,
    cancelados: turnos.filter(t => t.EstadoTurno === 'Cancelado').length,
    finalizados: turnos.filter(t => t.EstadoTurno === 'Finalizado').length
  }

  return (
    <div className="perfil-paciente-container">

      <div className="welcome-section fade-in">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <h1 className="welcome-name">Historial de Turnos</h1>
                  <p className="welcome-subtitle mb-0">
                    Consulta todos tus turnos médicos
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">medical_information</span>
                    Registro completo de citas
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {!loading && !error && turnos.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="stat-card stat-total">
                <div className="stat-icon">
                  <span className="material-symbols-outlined">event_note</span>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{estadisticas.total}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card stat-confirmados">
                <div className="stat-icon">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{estadisticas.confirmados}</div>
                  <div className="stat-label">Confirmados</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card stat-solicitados">
                <div className="stat-icon">
                  <span className="material-symbols-outlined">pending</span>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{estadisticas.solicitados}</div>
                  <div className="stat-label">Solicitados</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card stat-finalizados">
                <div className="stat-icon">
                  <span className="material-symbols-outlined">task_alt</span>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{estadisticas.finalizados}</div>
                  <div className="stat-label">Finalizados</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && !error && turnos.length > 0 && (
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <div className="d-flex align-items-center">
                  <span className="material-symbols-outlined text-primary me-2">filter_alt</span>
                  <h6 className="mb-0 fw-bold">Filtrar</h6>
                </div>
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${filtroEstado === 'Todos' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Todos')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`filter-btn ${filtroEstado === 'Confirmado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Confirmado')}
                  >
                    Confirmados
                  </button>
                  <button 
                    className={`filter-btn ${filtroEstado === 'Solicitado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Solicitado')}
                  >
                    Solicitados
                  </button>
                  <button 
                    className={`filter-btn ${filtroEstado === 'Cancelado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Cancelado')}
                  >
                    Cancelados
                  </button>
                  <button 
                    className={`filter-btn ${filtroEstado === 'Finalizado' ? 'active' : ''}`}
                    onClick={() => setFiltroEstado('Finalizado')}
                  >
                    Finalizados
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando historial de turnos...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <span className="material-symbols-outlined me-2">error</span>
            <div>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={cargarTurnos}
              >
                <span className="material-symbols-outlined me-1">refresh</span>
                Reintentar
              </button>
            </div>
          </div>
        )}
        {!loading && !error && turnosFiltrados.length === 0 && turnos.length > 0 && (
          <div className="text-center py-5">
            <span className="material-symbols-outlined text-muted mb-3" style={{ fontSize: '4rem' }}>
              filter_alt_off
            </span>
            <h5 className="text-muted">No hay turnos con el filtro seleccionado</h5>
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => setFiltroEstado('Todos')}
            >
              Ver todos los turnos
            </button>
          </div>
        )}

        {!loading && !error && turnos.length === 0 && (
          <div className="text-center py-5">
            <span className="material-symbols-outlined text-muted mb-3" style={{ fontSize: '4rem' }}>
              event_busy
            </span>
            <h5 className="text-muted">No tienes turnos registrados</h5>
            <p className="text-muted mb-3">Agenda tu primer turno para comenzar</p>
            
          </div>
        )}
        {!loading && !error && turnosFiltrados.length > 0 && (
          <div className="row g-3">
            {turnosPaginados.map((turno) => (
              <div key={turno.idTurno} className="col-12">
                <div className="turno-card">
                  <div className="turno-card-header">
                    <div className="turno-header-left">
                      <span className="material-symbols-outlined turno-icon">event</span>
                      <div>
                        <h6 className="turno-title">Turno #{turno.idTurno}</h6>
                        <span className={`badge ${getBadgeClass(turno.EstadoTurno)}`}>
                          {turno.EstadoTurno}
                        </span>
                      </div>
                    </div>
                    <div className="turno-header-right">
                      {puedeCancelar(turno.EstadoTurno) && (
                        <button
                          className="btn btn-outline-danger btn-sm turno-cancel-btn"
                          onClick={() => handleCancelarClick(turno)}
                        >
                          <span className="material-symbols-outlined">cancel</span>
                          <span className="d-none d-sm-inline ms-2">Cancelar</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="turno-card-body">
                    <div className="row g-3">
                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="turno-info-item">
                          <span className="material-symbols-outlined turno-info-icon text-primary">
                            calendar_today
                          </span>
                          <div>
                            <small className="turno-info-label">Fecha Solicitada</small>
                            <div className="turno-info-value">{formatearFecha(turno.FechaSolicitudTurno)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="turno-info-item">
                          <span className="material-symbols-outlined turno-info-icon text-info">
                            schedule
                          </span>
                          <div>
                            <small className="turno-info-label">Horario</small>
                            <div className="turno-info-value">{turno.HorarioRequeridoTurno || 'No asignado'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="turno-info-item">
                          <span className="material-symbols-outlined turno-info-icon text-success">
                            medical_services
                          </span>
                          <div>
                            <small className="turno-info-label">Tratamiento</small>
                            <div className="turno-info-value">{turno.NombreTratamiento || 'No asignado'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="turno-info-item">
                          <span className="material-symbols-outlined turno-info-icon text-warning">
                            person
                          </span>
                          <div>
                            <small className="turno-info-label">Profesional</small>
                            <div className="turno-info-value">{turno.NombreEmpleado || 'No asignado'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && turnosFiltrados.length > turnosPorPagina && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="pagination-container">
                <div className="pagination-info">
                  <span className="text-muted">
                    Mostrando {indexPrimerTurno + 1} - {Math.min(indexUltimoTurno, turnosFiltrados.length)} de {turnosFiltrados.length} turnos
                  </span>
                </div>
                <nav aria-label="Paginación de turnos">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={paginaAnterior}
                        disabled={paginaActual === 1}
                        aria-label="Anterior"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                        <span className="d-none d-sm-inline ms-1">Anterior</span>
                      </button>
                    </li>

                    {[...Array(totalPaginas)].map((_, index) => {
                      const numeroPagina = index + 1
                      if (
                        totalPaginas <= 5 || 
                        numeroPagina === 1 || 
                        numeroPagina === totalPaginas || 
                        (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1) 
                      ) {
                        return (
                          <li key={numeroPagina} className={`page-item ${paginaActual === numeroPagina ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => irAPagina(numeroPagina)}
                            >
                              {numeroPagina}
                            </button>
                          </li>
                        )
                      } else if (
                        numeroPagina === paginaActual - 2 || 
                        numeroPagina === paginaActual + 2
                      ) {
                        return (
                          <li key={numeroPagina} className="page-item disabled d-none d-md-block">
                            <span className="page-link">...</span>
                          </li>
                        )
                      }
                      return null
                    })}

                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={paginaSiguiente}
                        disabled={paginaActual === totalPaginas}
                        aria-label="Siguiente"
                      >
                        <span className="d-none d-sm-inline me-1">Siguiente</span>
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <CancelarTurnoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        turno={turnoSeleccionado}
        idPaciente={idPaciente}
        onTurnoCancelado={handleTurnoCancelado}
      />
    </div>
  )
}

export default HistorialTurnos