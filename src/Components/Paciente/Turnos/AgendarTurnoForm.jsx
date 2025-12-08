import React, { useState } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { solicitarTurno } from '../../../Custom/Paciente/CustomPacienteVista'
import { showSuccess } from '../../../Utils/sweetAlerts'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'
import '../../../Css/Paciente/Turnos/AgendarTurno.css'

const AgendarTurnoForm = ({ setActiveTab }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    FechaRequeridaTurno: '',
    HorarioRequeridoTurno: '',
    observaciones: ''
  })
  
  // Estados de la aplicación
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ordenMedicaFile, setOrdenMedicaFile] = useState(null)
  const [ordenMedicaPreview, setOrdenMedicaPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Obtener datos del paciente desde Zustand
  const { user } = useAuthStore()
  const pacienteInfo = user?.usuario || {}
  const idPaciente = pacienteInfo.idPaciente

  // Funciones para manejar drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      handleArchivoValidation(file)
    }
  }

  // Función para validar archivo
  const handleArchivoValidation = (file) => {
    if (!file) return

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      setError('Solo se permiten archivos de imagen (JPG, PNG, WebP)')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede superar los 5MB')
      return
    }

    // Guardar archivo y crear preview
    setOrdenMedicaFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setOrdenMedicaPreview(e.target.result)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  // Función para manejar la selección de archivo
  const handleArchivoChange = (e) => {
    const file = e.target.files[0]
    handleArchivoValidation(file)
  }

  // Función para quitar la orden médica
  const quitarOrdenMedica = () => {
    setOrdenMedicaFile(null)
    setOrdenMedicaPreview(null)
  }

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar mensajes de error cuando el usuario empiece a escribir
    if (error) setError(null)
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    const { FechaRequeridaTurno, HorarioRequeridoTurno } = formData

    if (!FechaRequeridaTurno) {
      throw new Error('La fecha del turno es requerida')
    }

    if (!HorarioRequeridoTurno) {
      throw new Error('El horario del turno es requerido')
    }

    // Validar que la fecha no sea en el pasado (anterior a hoy)
    const fechaSeleccionada = new Date(FechaRequeridaTurno + 'T00:00:00')
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    if (fechaSeleccionada < hoy) {
      throw new Error('No puede agendar un turno en una fecha pasada')
    }

    // Validar horario de atención (ejemplo: 8:00 a 18:00)
    const [hora] = HorarioRequeridoTurno.split(':').map(Number)
    if (hora < 8 || hora > 18) {
      throw new Error('El horario debe estar entre 08:00 y 18:00')
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!idPaciente) {
      setError('No se encontró la información del paciente')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Validar formulario
      validarFormulario()

      // Preparar datos para el backend
      const turnoData = {
        FechaRequeridaTurno: formData.FechaRequeridaTurno,
        HorarioRequeridoTurno: formData.HorarioRequeridoTurno,
        idPaciente: idPaciente.toString(),
        InformeTurno: formData.observaciones || null,
        ordenMedicaFile: ordenMedicaFile
      }

      // Enviar solicitud
      await solicitarTurno(turnoData)
      
      // Mostrar alerta de éxito
      await showSuccess(
        '¡Turno solicitado con éxito!',
        'Tu solicitud ha sido enviada correctamente. Recibirás una confirmación pronto.'
      )
      
      // Limpiar formulario
      setFormData({
        FechaRequeridaTurno: '',
        HorarioRequeridoTurno: '',
        observaciones: ''
      })
      setOrdenMedicaFile(null)
      setOrdenMedicaPreview(null)
      
      // Redirigir al perfil
      if (setActiveTab) {
        setActiveTab('perfil')
      }

    } catch (err) {
      console.error('Error al agendar turno:', err)
      setError(err.message || 'Error al agendar el turno')
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener fecha mínima (hoy)
  const getFechaMinima = () => {
    const hoy = new Date()
    return hoy.toISOString().split('T')[0]
  }

  // Función para generar opciones de horarios
  const generarHorarios = () => {
    const horarios = []
    for (let hora = 8; hora <= 18; hora++) {
      for (let minutos of [0, 30]) {
        if (hora === 18 && minutos === 30) break // No permitir 18:30
        const horaStr = hora.toString().padStart(2, '0')
        const minStr = minutos.toString().padStart(2, '0')
        horarios.push(`${horaStr}:${minStr}`)
      }
    }
    return horarios
  }

  return (
    <div className="perfil-paciente-container">
      {/* Header */}
      <div className="welcome-section fade-in">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="welcome-avatar rounded-circle d-flex align-items-center justify-content-center me-4">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <div>
                  <h1 className="welcome-name">Agendar Nuevo Turno</h1>
                  <p className="welcome-subtitle mb-0">
                    Solicita tu próxima cita médica
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">calendar_today</span>
                    Selecciona fecha y horario disponible
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
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                <span className="material-symbols-outlined me-2">error</span>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="perfil-nav-card agendar-turno-form">
              <div className="card-icon mb-4">
                <span className="material-symbols-outlined">event_note</span>
              </div>
              <h3 className="card-title mb-4">Datos del Turno</h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  {/* Orden médica */}
                  <div className="col-12">
                    <label htmlFor="ordenMedica" className="form-label fw-bold">
                      <span className="material-symbols-outlined me-2">upload_file</span>
                      Orden Médica (Opcional)
                    </label>
                    
                    {!ordenMedicaFile ? (
                      <div 
                        className={`upload-area ${isDragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('ordenMedica').click()}
                      >
                        <input
                          type="file"
                          id="ordenMedica"
                          className="d-none"
                          accept="image/*"
                          onChange={handleArchivoChange}
                          disabled={loading}
                        />
                        <div className="upload-content">
                          <span className={`material-symbols-outlined upload-icon ${isDragging ? 'text-primary' : ''}`}>
                            cloud_upload
                          </span>
                          <p className="upload-title">
                            {isDragging ? '¡Suelta aquí tu archivo!' : 'Subir Orden Médica'}
                          </p>
                          <p className="upload-subtitle">
                            Haz clic aquí o arrastra tu archivo
                          </p>
                          <small className="upload-info">
                            <span className="material-symbols-outlined me-1">image</span>
                            Formatos: JPG, PNG, WebP (máx. 5MB)
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div className="uploaded-file">
                        <div className="d-flex align-items-center">
                          <img 
                            src={ordenMedicaPreview} 
                            alt="Orden médica" 
                            className="uploaded-preview"
                          />
                          <div>
                            <p className="uploaded-success">
                              <span className="material-symbols-outlined me-2">check_circle</span>
                              Orden médica seleccionada
                            </p>
                            <small className="uploaded-filename">{ordenMedicaFile.name}</small>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={quitarOrdenMedica}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    )}
                    
                    <div className="form-text mt-2">
                      <span className="material-symbols-outlined icon-info">info</span>
                      Sube una foto de tu orden médica si la tienes
                    </div>
                  </div>

                  {/* Fecha del turno */}
                  <div className="col-md-6 col-12">
                    <label htmlFor="FechaRequeridaTurno" className="form-label fw-bold">
                      <span className="material-symbols-outlined me-2">calendar_today</span>
                      Fecha del Turno *
                    </label>
                    <input
                      type="date"
                      id="FechaRequeridaTurno"
                      name="FechaRequeridaTurno"
                      className="form-control"
                      value={formData.FechaRequeridaTurno}
                      onChange={handleInputChange}
                      min={getFechaMinima()}
                      required
                    />
                    <div className="form-text">
                      <span className="material-symbols-outlined icon-info">info</span>
                      Selecciona una fecha a partir de mañana
                    </div>
                  </div>

                  {/* Horario del turno */}
                  <div className="col-md-6 col-12">
                    <label htmlFor="HorarioRequeridoTurno" className="form-label fw-bold">
                      <span className="material-symbols-outlined me-2">schedule</span>
                      Horario *
                    </label>
                    <select
                      id="HorarioRequeridoTurno"
                      name="HorarioRequeridoTurno"
                      className="form-select"
                      value={formData.HorarioRequeridoTurno}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un horario</option>
                      {generarHorarios().map(horario => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">
                      <span className="material-symbols-outlined icon-info">info</span>
                      Horarios disponibles de 08:00 a 18:00
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="col-12">
                    <label htmlFor="observaciones" className="form-label fw-bold">
                      <span className="material-symbols-outlined me-2">note</span>
                      Observaciones (Opcional)
                    </label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      className="form-control"
                      rows="3"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      placeholder="Describe tu situación o solicitud específica..."
                    ></textarea>
                    <div className="form-text">
                      Información adicional que consideres importante
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="col-12">
                    <div className="d-flex gap-3 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center"
                        onClick={() => {
                          setFormData({
                            FechaRequeridaTurno: '',
                            HorarioRequeridoTurno: '',
                            observaciones: ''
                          })
                          setOrdenMedicaFile(null)
                          setOrdenMedicaPreview(null)
                          setError(null)
                        }}
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined me-2">clear</span>
                        Limpiar
                      </button>
                      
                      <button
                        type="submit"
                        className="btn btn-primary d-flex align-items-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            Agendando...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined me-2">event_available</span>
                            Agendar Turno
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
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8 col-12">
                    <h6 className="card-title mb-1 text-dark">
                      <span className="material-symbols-outlined me-2 text-primary">info</span>
                      Información Importante
                    </h6>
                    <p className="card-text text-muted mb-0">
                      Tu turno quedará en estado "Solicitado" hasta que sea confirmado por nuestro personal.
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

export default AgendarTurnoForm