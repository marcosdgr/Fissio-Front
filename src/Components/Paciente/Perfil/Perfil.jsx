import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerPacientePorId, obtenerTurnosPorPaciente } from '../../../Custom/Paciente/CustomPacienteVista'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'

const Perfil = ({ setActiveTab }) => {
  // Estados para manejar la información del paciente
  const [pacienteData, setPacienteData] = useState(null)
  const [turnosData, setTurnosData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener datos del paciente desde Zustand
  const { user } = useAuthStore()
  
  // Obtener información del paciente de la estructura del login
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente
  const nombrePaciente = pacienteData?.NombrePaciente || pacienteInfo.NombrePaciente || 'Usuario'
  //const apellidoPaciente = pacienteData?.ApellidoPaciente || pacienteInfo.ApellidoPaciente || ''

  // useEffect para cargar datos del paciente
  useEffect(() => {
    const cargarDatosPaciente = async () => {
      if (!idPaciente) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Cargar datos del paciente
        const datosPaciente = await obtenerPacientePorId(idPaciente)
        setPacienteData(datosPaciente)

        // Cargar turnos del paciente
        const turnos = await obtenerTurnosPorPaciente(idPaciente)
        setTurnosData(turnos)

      } catch (err) {
        console.error('Error al cargar datos del paciente:', err)
        setError('Error al cargar la información del paciente')
      } finally {
        setLoading(false)
      }
    }

    cargarDatosPaciente()
  }, [idPaciente])

  // Funciones para calcular estadísticas de turnos
  const calcularTurnosProximos = () => {
    if (!turnosData) return 0
    const hoy = new Date()
    return turnosData.filter(turno => {
      const fechaTurno = new Date(turno.FechaRequeridaTurno)
      return fechaTurno >= hoy && (turno.EstadoTurno === 'Solicitado' || turno.EstadoTurno === 'Pendiente')
    }).length
  }

  const calcularTurnosCompletados = () => {
    if (!turnosData) return 0
    return turnosData.filter(turno => 
      turno.EstadoTurno === 'Finalizado'
    ).length
  }

  // Función para formatear la fecha actual
  const formatearFecha = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Funciones para manejar clicks de las cards y navegación
  const handlePerfilInfo = () => {
    console.log('Navegando a información del perfil...')
    if (setActiveTab) {
      setActiveTab('perfilInfo')
    }
  }

  const handleProximosTurnos = () => {
    console.log('Navegando a próximos turnos...')
    // Aquí iría la lógica de navegación
  }

  const handleHistorialTurnos = () => {
    console.log('Navegando a historial de turnos...')
    // Aquí iría la lógica de navegación
  }

  const handleAgendarTurno = () => {
    console.log('Navegando a agendar turno...')
    // Aquí iría la lógica de navegación
  }

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="perfil-paciente-container">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex align-items-center">
            <span className="material-symbols-outlined me-2">error</span>
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="perfil-paciente-container">
      {/* Mensaje de Bienvenida */}
      <div className="welcome-section fade-in">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <div className="d-flex align-items-center">
                <div 
                  className="welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4"
                  onClick={handlePerfilInfo}
                  role="button"
                  tabIndex={0}
                  style={{cursor: 'pointer'}}
                  title="Ver información del perfil"
                >
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h1 className="welcome-name">
                    ¡Hola, {nombrePaciente}!
                  </h1>
                  <p className="welcome-subtitle mb-0">
                    Bienvenido a tu panel personal de Fissio
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">calendar_today</span>
                    {formatearFecha()}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-5 text-md-end text-center mt-3 mt-md-0">
              <div className="card-stats">
                <div className="stats-number">
                  {loading ? '...' : turnosData?.length || 0}
                </div>
                <div className="stats-label">Turnos registrados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Navegación */}
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <h3 className="section-title mb-4">
              <span className="material-symbols-outlined me-2">dashboard</span>
              Panel de Control
            </h3>
            
            <div className="row perfil-nav-cards slide-up g-3">
              {/* Card Próximos Turnos */}
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div 
                  className="perfil-nav-card h-100" 
                  onClick={handleProximosTurnos}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <h5 className="card-title">Próximos Turnos</h5>
                  <p className="card-description">
                    Consulta y gestiona tus próximas citas médicas programadas
                  </p>
                  <div className="card-stats">
                    <div>
                      <div className="stats-number">
                        {loading ? '...' : calcularTurnosProximos()}
                      </div>
                      <div className="stats-label">Próximos</div>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Historial de Turnos */}
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div 
                  className="perfil-nav-card h-100"
                  onClick={handleHistorialTurnos}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <h5 className="card-title">Historial de Turnos</h5>
                  <p className="card-description">
                    Revisa el historial completo de tus consultas y tratamientos anteriores
                  </p>
                  <div className="card-stats">
                    <div>
                      <div className="stats-number">
                        {loading ? '...' : calcularTurnosCompletados()}
                      </div>
                      <div className="stats-label">Completados</div>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Agendar Turno */}
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div 
                  className="perfil-nav-card h-100"
                  onClick={handleAgendarTurno}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">add_circle</span>
                  </div>
                  <h5 className="card-title">Agendar Turno</h5>
                  <p className="card-description">
                    Solicita una nueva cita médica de forma rápida y sencilla
                  </p>
                  <div className="card-stats">
                    <div>
                      <div className="stats-number">+</div>
                      <div className="stats-label">Nuevo</div>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="row mt-3 mb-0">
          <div className="col-12">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8 col-12">
                    <h6 className="card-title mb-1 text-dark">
                      <span className="material-symbols-outlined me-2 text-primary">info</span>
                      Información del Paciente
                    </h6>
                    <p className="card-text text-muted mb-0">
                      {loading ? 'Cargando información...' : 
                       pacienteData ? 
                       `DNI: ${pacienteData.DNI} | Localidad: ${pacienteData.NombreLocalidad}` :
                       'Sistema de gestión Fissio - Panel del Paciente'
                      }
                    </p>
                  </div>
                  <div className="col-md-4 col-12 text-md-end text-center mt-2 mt-md-0">
                    <small className="text-muted">
                      <span className="material-symbols-outlined me-1">support_agent</span>
                      ¿Necesitas ayuda? Contacta soporte
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil