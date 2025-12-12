import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerPacientePorId, obtenerTurnosPorPaciente, obtenerEstadoTurnoPorPaciente} from '../../../Custom/Paciente/CustomPacienteVista'
import CardProximosTurnos from '../Turnos/CardProximosTurnos'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'

const Perfil = ({ setActiveTab }) => {
  const [pacienteData, setPacienteData] = useState(null)
  const [turnosData, setTurnosData] = useState([])
  const [turnosDetalles, setTurnosDetalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user } = useAuthStore()
  
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente
  const nombrePaciente = pacienteData?.NombrePaciente || pacienteInfo.NombrePaciente || 'Usuario'

  useEffect(() => {
    const cargarDatosPaciente = async () => {
      if (!idPaciente) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const datosPaciente = await obtenerPacientePorId(idPaciente)
        setPacienteData(datosPaciente)

        const turnos = await obtenerTurnosPorPaciente(idPaciente)
        setTurnosData(turnos)

        const detalles = await obtenerEstadoTurnoPorPaciente(idPaciente)
        setTurnosDetalles(detalles)

      } catch (err) {
        console.error('Error al cargar datos del paciente:', err)
        setError('Error al cargar la información del paciente')
      } finally {
        setLoading(false)
      }
    }

    cargarDatosPaciente()
  }, [idPaciente])

  const formatearFecha = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePerfilInfo = () => {
    console.log('Navegando a información del perfil...')
    if (setActiveTab) {
      setActiveTab('perfilInfo')
    }
  }

  const handleHistorialTurnos = () => {
    console.log('Navegando a historial de turnos...')
    if (setActiveTab) {
      setActiveTab('historial')
    }
  }

  const handleAgendarTurno = () => {
    console.log('Navegando a agendar turno...')
    if (setActiveTab) {
      setActiveTab('agendar')
    }
  }

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

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <h3 className="section-title mb-4">
              <span className="material-symbols-outlined me-2">dashboard</span>
              Panel de Control
            </h3>
            
            <div className="row perfil-nav-cards slide-up g-3">
              <CardProximosTurnos 
                turnosDetalles={turnosDetalles}
                loading={loading}
              />
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div 
                  className="perfil-nav-card"
                  onClick={handleHistorialTurnos}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <h5 className="card-title">Historial de Turnos</h5>
                  <p className="card-description mb-3">
                    Revisa el historial completo de tus consultas y tratamientos anteriores
                  </p>
                  <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 border border-1">
                    <span className="text-primary fw-medium">Ver Historial</span>
                    <span className="material-symbols-outlined text-primary">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div 
                  className="perfil-nav-card"
                  onClick={handleAgendarTurno}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">add_circle</span>
                  </div>
                  <h5 className="card-title">Agendar Turno</h5>
                  <p className="card-description mb-3">
                    Solicita una nueva cita médica de forma rápida y sencilla
                  </p>

                  <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 border border-1">
                    <span className="text-primary fw-medium">Nuevo Turno</span>
                    <span className="material-symbols-outlined text-primary">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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