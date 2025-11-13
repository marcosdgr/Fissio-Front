import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerPacientePorId, actualizarPaciente, obtenerEmailPacientePorId} from '../../../Custom/Paciente/CustomPacienteVista'
import { getLocalidades } from '../../../Custom/CustomRegister'
import '../../../Css/Paciente/Perfil/ConfigPaciente.css'

const Configuracion = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    NombrePaciente: '',
    ApellidoPaciente: '',
    DNI: '', // Agregamos DNI (solo para envío, no editable)
    TelefonoPaciente: '',
    DireccionPaciente: '',
    FechaNacPaciente: '',
    Sexo: '',
    idLocalidad: ''
  })

  // Estados de la aplicación
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [localidades, setLocalidades] = useState([])
  const [pacienteOriginal, setPacienteOriginal] = useState(null)
  const [emailPaciente, setEmailPaciente] = useState(null)

  // Obtener datos del paciente desde Zustand
  const { user } = useAuthStore()
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente

  // useEffect para cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      if (!idPaciente) {
        setError('No se encontró información del paciente')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Cargar datos del paciente, email y localidades en paralelo
        const [datosPaciente, emailData, localidadesData] = await Promise.all([
          obtenerPacientePorId(idPaciente),
          obtenerEmailPacientePorId(idPaciente),
          getLocalidades()
        ])

        // Guardar datos originales
        setPacienteOriginal(datosPaciente)
        setEmailPaciente(emailData.MailUsuario)

        // Llenar formulario con datos actuales
        setFormData({
          NombrePaciente: datosPaciente.NombrePaciente || '',
          ApellidoPaciente: datosPaciente.ApellidoPaciente || '',
          DNI: datosPaciente.DNI || '', // Incluir DNI para envío
          TelefonoPaciente: datosPaciente.TelefonoPaciente || '',
          DireccionPaciente: datosPaciente.DireccionPaciente || '',
          FechaNacPaciente: datosPaciente.FechaNacPaciente ? 
            datosPaciente.FechaNacPaciente.split('T')[0] : '',
          Sexo: datosPaciente.Sexo || '',
          idLocalidad: datosPaciente.idLocalidad || ''
        })

        setLocalidades(localidadesData)

      } catch (err) {
        console.error('Error al cargar datos:', err)
        setError('Error al cargar la información')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [idPaciente])

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar mensajes
    if (error) setError(null)
    if (success) setSuccess(false)
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    const { NombrePaciente, ApellidoPaciente, TelefonoPaciente, DireccionPaciente, FechaNacPaciente, Sexo, idLocalidad } = formData

    if (!NombrePaciente.trim()) {
      throw new Error('El nombre es requerido')
    }

    if (!ApellidoPaciente.trim()) {
      throw new Error('El apellido es requerido')
    }

    if (!TelefonoPaciente.trim()) {
      throw new Error('El teléfono es requerido')
    }

    if (!DireccionPaciente.trim()) {
      throw new Error('La dirección es requerida')
    }

    if (!FechaNacPaciente) {
      throw new Error('La fecha de nacimiento es requerida')
    }

    if (!Sexo) {
      throw new Error('El sexo es requerido')
    }

    if (!idLocalidad) {
      throw new Error('La localidad es requerida')
    }

    // Validar fecha de nacimiento (no puede ser futura)
    const fechaNac = new Date(FechaNacPaciente)
    const hoy = new Date()
    if (fechaNac > hoy) {
      throw new Error('La fecha de nacimiento no puede ser futura')
    }

    // Validar edad mínima (ej: 18 años)
    const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000))
    if (edad < 0) {
      throw new Error('La fecha de nacimiento no es válida')
    }
  }

  // Función para verificar si hay cambios
  const hayChangeios = () => {
    if (!pacienteOriginal) return false
    
    return (
      formData.NombrePaciente !== (pacienteOriginal.NombrePaciente || '') ||
      formData.ApellidoPaciente !== (pacienteOriginal.ApellidoPaciente || '') ||
      formData.TelefonoPaciente !== (pacienteOriginal.TelefonoPaciente || '') ||
      formData.DireccionPaciente !== (pacienteOriginal.DireccionPaciente || '') ||
      formData.FechaNacPaciente !== (pacienteOriginal.FechaNacPaciente ? pacienteOriginal.FechaNacPaciente.split('T')[0] : '') ||
      formData.Sexo !== (pacienteOriginal.Sexo || '') ||
      parseInt(formData.idLocalidad) !== (pacienteOriginal.idLocalidad || 0)
      // Nota: No verificamos DNI porque no es editable
    )
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      // Validar formulario
      validarFormulario()

      // Verificar si hay cambios
      if (!hayChangeios()) {
        setError('No hay cambios para guardar')
        return
      }

      // Preparar datos para actualizar
      const datosActualizados = {
        ...formData,
        idLocalidad: parseInt(formData.idLocalidad)
      }

      // Actualizar paciente
      await actualizarPaciente(idPaciente, datosActualizados)

      // Mostrar éxito
      setSuccess(true)
      
      // Actualizar datos originales
      setPacienteOriginal({
        ...pacienteOriginal,
        ...datosActualizados
      })

      // Auto-ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)

    } catch (err) {
      console.error('Error al actualizar datos:', err)
      setError(err.message || 'Error al actualizar los datos')
    } finally {
      setSaving(false)
    }
  }

  // Función para restablecer el formulario
  const handleReset = () => {
    if (!pacienteOriginal) return

    setFormData({
      NombrePaciente: pacienteOriginal.NombrePaciente || '',
      ApellidoPaciente: pacienteOriginal.ApellidoPaciente || '',
      DNI: pacienteOriginal.DNI || '', // Incluir DNI en reset
      TelefonoPaciente: pacienteOriginal.TelefonoPaciente || '',
      DireccionPaciente: pacienteOriginal.DireccionPaciente || '',
      FechaNacPaciente: pacienteOriginal.FechaNacPaciente ? 
        pacienteOriginal.FechaNacPaciente.split('T')[0] : '',
      Sexo: pacienteOriginal.Sexo || '',
      idLocalidad: pacienteOriginal.idLocalidad || ''
    })

    setError(null)
    setSuccess(false)
  }

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No disponible'
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    const edad = Math.floor((hoy - nacimiento) / (365.25 * 24 * 60 * 60 * 1000))
    return `${edad} años`
  }

  // Loading state
  if (loading) {
    return (
      <div className="config-paciente-container">
        <div className="config-loading-container">
          <div className="config-loading-spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="config-paciente-container config-fade-in">
      {/* Header */}
      <div className="config-welcome-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="config-welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <div>
                  <h1 className="welcome-name">Configuración</h1>
                  <p className="welcome-subtitle mb-0">
                    Edita tu información personal
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">edit</span>
                    Mantén tus datos actualizados
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-12">
            
            {/* Mensajes de estado */}
            {success && (
              <div className="config-alert-success d-flex align-items-center" role="alert">
                <span className="material-symbols-outlined me-2">check_circle</span>
                <div>
                  <strong>¡Datos actualizados con éxito!</strong>
                  <div>Tu información ha sido guardada correctamente.</div>
                </div>
              </div>
            )}

            {error && (
              <div className="config-alert-danger d-flex align-items-center" role="alert">
                <span className="material-symbols-outlined me-2">error</span>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="config-form-card">
              <div className="config-form-icon">
                <span className="material-symbols-outlined">person_edit</span>
              </div>
              <h3 className="config-form-title">Datos Personales</h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  {/* Nombre */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="NombrePaciente" className="config-form-label">
                      <span className="material-symbols-outlined">person</span>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="NombrePaciente"
                      name="NombrePaciente"
                      className="config-form-control form-control"
                      value={formData.NombrePaciente}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>

                  {/* Apellido */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="ApellidoPaciente" className="config-form-label">
                      <span className="material-symbols-outlined">person</span>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      id="ApellidoPaciente"
                      name="ApellidoPaciente"
                      className="config-form-control form-control"
                      value={formData.ApellidoPaciente}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="TelefonoPaciente" className="config-form-label">
                      <span className="material-symbols-outlined">phone</span>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="TelefonoPaciente"
                      name="TelefonoPaciente"
                      className="config-form-control form-control"
                      value={formData.TelefonoPaciente}
                      onChange={handleInputChange}
                      placeholder="Ej: +54 9 11 1234-5678"
                      required
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="FechaNacPaciente" className="config-form-label">
                      <span className="material-symbols-outlined">cake</span>
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      id="FechaNacPaciente"
                      name="FechaNacPaciente"
                      className="config-form-control form-control"
                      value={formData.FechaNacPaciente}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {formData.FechaNacPaciente && (
                      <div className="config-age-display">
                        <span className="material-symbols-outlined me-1" style={{fontSize: '1rem'}}>info</span>
                        Edad: {calcularEdad(formData.FechaNacPaciente)}
                      </div>
                    )}
                  </div>

                  {/* Sexo */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="Sexo" className="config-form-label">
                      <span className="material-symbols-outlined">wc</span>
                      Sexo *
                    </label>
                    <select
                      id="Sexo"
                      name="Sexo"
                      className="config-form-select form-select"
                      value={formData.Sexo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  {/* Localidad */}
                  <div className="col-md-6 config-form-group">
                    <label htmlFor="idLocalidad" className="config-form-label">
                      <span className="material-symbols-outlined">location_on</span>
                      Localidad *
                    </label>
                    <select
                      id="idLocalidad"
                      name="idLocalidad"
                      className="config-form-select form-select"
                      value={formData.idLocalidad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una localidad</option>
                      {localidades.map(localidad => (
                        <option key={localidad.idLocalidad} value={localidad.idLocalidad}>
                          {localidad.NombreLocalidad} - {localidad.NombreProvincia}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dirección */}
                  <div className="col-md-12 config-form-group">
                    <label htmlFor="DireccionPaciente" className="config-form-label">
                      <span className="material-symbols-outlined">home</span>
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="DireccionPaciente"
                      name="DireccionPaciente"
                      className="config-form-control form-control"
                      value={formData.DireccionPaciente}
                      onChange={handleInputChange}
                      placeholder="Ej: Av. Corrientes 1234, CABA"
                      required
                    />
                  </div>

                  {/* Información no editable */}
                  <div className="col-12">
                    <div className="config-readonly-section">
                      <h6 className="config-readonly-title">
                        <span className="material-symbols-outlined me-2">lock</span>
                        Información no editable
                      </h6>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">DNI:</div>
                            <div className="config-readonly-value">{pacienteOriginal?.DNI || 'No disponible'}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">Email:</div>
                            <div className="config-readonly-value">{emailPaciente || 'No disponible'}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="config-readonly-item">
                            <div className="config-readonly-label">Contraseña:</div>
                            <div className="config-readonly-value">••••••••</div>
                          </div>
                        </div>
                      </div>
                      <small className="text-muted mt-2 d-block">
                        Contacta al administrador para modificar estos datos
                      </small>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="col-12">
                    <div className="d-flex gap-3 justify-content-end">
                      <button
                        type="button"
                        className="config-btn-secondary d-flex align-items-center config-btn"
                        onClick={handleReset}
                        disabled={saving || !hayChangeios()}
                      >
                        <span className="material-symbols-outlined me-2">refresh</span>
                        Restablecer
                      </button>
                      
                      <button
                        type="submit"
                        className="config-btn-primary d-flex align-items-center config-btn"
                        disabled={saving || !hayChangeios()}
                      >
                        {saving ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined me-2">save</span>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="row mt-4 mb-0">
          <div className="col-12">
            <div className="config-info-card">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8 col-12">
                    <h6 className="config-info-title">
                      <span className="material-symbols-outlined me-2">info</span>
                      Información Importante
                    </h6>
                    <p className="config-info-text">
                      Mantén tus datos actualizados para recibir notificaciones y confirmaciones de turnos.
                    </p>
                  </div>
                  <div className="col-md-4 col-12 text-md-end text-center mt-2 mt-md-0">
                    <small className="text-muted">
                      <span className="material-symbols-outlined me-1">support_agent</span>
                      ¿Dudas? Contacta soporte
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

export default Configuracion