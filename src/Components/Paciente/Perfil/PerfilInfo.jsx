import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerPacientePorId } from '../../../Custom/Paciente/CustomPacienteVista'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'

const PerfilInfo = ({ setActiveTab }) => {
  const [pacienteData, setPacienteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user } = useAuthStore()
  
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente

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

      } catch (err) {
        console.error('Error al cargar datos del paciente:', err)
        setError('Error al cargar la información del paciente')
      } finally {
        setLoading(false)
      }
    }

    cargarDatosPaciente()
  }, [idPaciente])

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible'
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No disponible'
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return `${edad} años`
  }

  if (loading) {
    return (
      <div className="perfil-paciente-container">
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando información del paciente...</p>
          </div>
        </div>
      </div>
    )
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

  const handleVolver = () => {
    if (setActiveTab) {
      setActiveTab('perfil')
    }
  }

  const datosCompletos = pacienteData || pacienteInfo
  const nombreCompleto = `${datosCompletos.NombrePaciente || ''} ${datosCompletos.ApellidoPaciente || ''}`.trim()

  return (
    <div className="perfil-paciente-container">
      <div className="container-fluid mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <button 
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleVolver}
            style={{borderRadius: '10px'}}
          >
            <span className="material-symbols-outlined me-2">arrow_back</span>
            Volver al Perfil
          </button>
          <div className="text-muted">
            <small>
              <span className="material-symbols-outlined me-1" style={{fontSize: '1rem'}}>info</span>
              Información detallada del paciente
            </small>
          </div>
        </div>
      </div>
      <div className="welcome-section fade-in">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4" style={{width: '80px', height: '80px'}}>
                  <span className="material-symbols-outlined" style={{fontSize: '2.5rem'}}>person</span>
                </div>
                <div>
                  <h1 className="welcome-name">Información Personal</h1>
                  <p className="welcome-subtitle mb-0">
                    Datos completos de {nombreCompleto || 'Usuario'}
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">account_circle</span>
                    Perfil del Paciente
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <h3 className="section-title mb-4">
              <span className="material-symbols-outlined me-2">badge</span>
              Datos Personales
            </h3>
            <div className="row g-4">
              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="perfil-nav-card h-100">
                  <div className="card-icon mb-3">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <h5 className="card-title">Información Básica</h5>
                  
                  <div className="info-row mb-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Nombre completo:</span>
                      <span className="text-dark">{nombreCompleto || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">DNI:</span>
                      <span className="text-dark">{datosCompletos.DNI || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Fecha de Nacimiento:</span>
                      <span className="text-dark">{formatearFecha(datosCompletos.FechaNacPaciente)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-muted">Edad:</span>
                      <span className="text-dark">{calcularEdad(datosCompletos.FechaNacPaciente)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="perfil-nav-card h-100">
                  <div className="card-icon mb-3">
                    <span className="material-symbols-outlined">contact_phone</span>
                  </div>
                  <h5 className="card-title">Información de Contacto</h5>
                  
                  <div className="info-row mb-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Teléfono:</span>
                      <span className="text-dark">{datosCompletos.TelefonoPaciente || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Email:</span>
                      <span className="text-dark">{datosCompletos.MailUsuario || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Dirección:</span>
                      <span className="text-dark">{datosCompletos.DireccionPaciente || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-muted">Localidad:</span>
                      <span className="text-dark">{datosCompletos.NombreLocalidad || 'No disponible'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12">
                <div className="perfil-nav-card h-100">
                  <div className="card-icon mb-3">
                    <span className="material-symbols-outlined">medical_information</span>
                  </div>
                  <h5 className="card-title">Información Médica</h5>
                  
                  <div className="info-row mb-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold text-muted">Sexo:</span>
                      <span className="text-dark">{datosCompletos.Sexo || 'No disponible'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-muted">Estado:</span>
                      <span className={`badge ${datosCompletos.IsActive ? 'bg-success' : 'bg-secondary'}`}>
                        {datosCompletos.IsActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4 mb-0">
          <div className="col-12">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8 col-12">
                    <h6 className="card-title mb-1 text-dark">
                      <span className="material-symbols-outlined me-2 text-primary">info</span>
                      Información del Sistema
                    </h6>
                    <p className="card-text text-muted mb-0">
                      {loading ? 'Cargando información...' : 
                       pacienteData ? 
                       `ID Usuario: ${datosCompletos.idUsuario || 'N/A'}` :
                       'Sistema de gestión Fissio - Información del Paciente'
                      }
                    </p>
                  </div>
                  <div className="col-md-4 col-12 text-md-end text-center mt-2 mt-md-0">
                    <small className="text-muted">
                      <span className="material-symbols-outlined me-1">shield</span>
                      Datos protegidos y confidenciales
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

export default PerfilInfo