import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../../Store/useAuthStore'
import { obtenerComentariosPorPaciente } from '../../../Custom/Paciente/CustomPacienteVista'
import { showError } from '../../../Utils/sweetAlerts'
import FeedbackFormulario from '../../FeedBack/FeedbackFormulario'
import FeedbackExito from '../../FeedBack/FeedbackExito'
import axios from 'axios'
import { BASE_URL } from '../../../Api/api'
import '../../../Css/Paciente/Perfil/PerfilPaciente.css'
import '../../../Css/Paciente/Comentarios/ComentariosPaciente.css'
import '../../../Css/Feedback/Feedback.css'

const ComentariosDelPaciente = () => {
  // Estados del formulario de feedback
  const [calificacion, setCalificacion] = useState(0)
  const [calificacionHover, setCalificacionHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [ultimaCalificacion, setUltimaCalificacion] = useState(null)
  
  // Estados para comentarios
  const [misComentarios, setMisComentarios] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const comentariosPorPagina = 4

  // Obtener datos del usuario
  const { user } = useAuthStore()
  const userData = user?.usuario || {}
  // idUsuario es el ID del usuario en la tabla usuarios (para crear comentarios)
  const idUsuario = userData.idUsuario
  // idPaciente es el ID del paciente en la tabla pacientes (para obtener comentarios)
  const idPaciente = userData.idPaciente || userData.idUsuario

  // Cargar comentarios del paciente específico
  const cargarComentariosPaciente = async () => {
    if (!idPaciente) return
    
    try {
      setLoading(true)
      const comentarios = await obtenerComentariosPorPaciente(idPaciente)
      
      if (Array.isArray(comentarios)) {
        setMisComentarios(comentarios)
      } else {
        setMisComentarios([])
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error)
      setMisComentarios([])
      showError('Error', 'No se pudieron cargar los comentarios')
    } finally {
      setLoading(false)
    }
  }

  // Cargar comentarios al montar el componente
  useEffect(() => {
    cargarComentariosPaciente()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPaciente])

  // Función para enviar el comentario (similar a Feedback.jsx)
  const enviarComentario = async (e) => {
    e.preventDefault()

    // Validaciones
    if (calificacion === 0) {
      showError('Error', 'Por favor, selecciona una calificación')
      return
    }

    if (!comentario.trim()) {
      showError('Error', 'Por favor, escribe tu comentario')
      return
    }

    if (!idUsuario) {
      showError('Error', 'No se pudo identificar al usuario')
      return
    }

    try {
      setEnviando(true)

      const datosComentario = {
        CalificacionComentario: calificacion,
        Comentario: comentario.trim(),
        idUsuario: idUsuario,
      }

      await axios.post(`${BASE_URL}api/comentarios/v1/crear`, datosComentario)
      
      // Guardar la calificación enviada, limpiar formulario y mostrar éxito
      setUltimaCalificacion(calificacion)
      setCalificacion(0)
      setComentario('')
      setEnviado(true)

      // Recargar comentarios del paciente
      await cargarComentariosPaciente()
      setPaginaActual(1)

    } catch (error) {
      console.error('Error al enviar comentario:', error)
      const mensajeError = error.response?.data?.message || 'Error al enviar el comentario'
      showError('Error al enviar', mensajeError)
    } finally {
      setEnviando(false)
    }
  }

  // Función para abrir el modal de nuevo comentario
  const abrirModalComentario = () => {
    setShowModal(true)
    setEnviado(false)
    setCalificacion(0)
    setComentario('')
    setUltimaCalificacion(null)
  }

  // Función para cerrar el modal
  const cerrarModal = () => {
    setShowModal(false)
    setEnviado(false)
    setCalificacion(0)
    setComentario('')
  }

  // Función para resetear el formulario y dejar otro comentario
  const nuevoComentario = () => {
    setEnviado(false)
    setCalificacion(0)
    setComentario('')
    setUltimaCalificacion(null)
  }

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible'
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para obtener clase de badge según estado
  const getEstadoBadge = (isPublicado) => {
    return isPublicado ? 'badge bg-success' : 'badge bg-warning text-dark'
  }

  const getEstadoTexto = (isPublicado) => {
    return isPublicado ? 'Publicado' : 'En revisión'
  }

  // Función para renderizar estrellas
  const renderEstrellas = (cantidad) => {
    return (
      <div className="comentario-estrellas-display">
        {[1, 2, 3, 4, 5].map((num) => (
          <span 
            key={num} 
            className={`estrella-display ${num <= cantidad ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  // Calcular comentarios a mostrar en la página actual
  const indiceUltimo = paginaActual * comentariosPorPagina
  const indicePrimero = indiceUltimo - comentariosPorPagina
  const comentariosActuales = misComentarios.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(misComentarios.length / comentariosPorPagina)

  // Funciones de paginación
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                  <span className="material-symbols-outlined">comment</span>
                </div>
                <div>
                  <h1 className="welcome-name">Mis Comentarios</h1>
                  <p className="welcome-subtitle mb-0">
                    Comparte tu experiencia con nosotros
                  </p>
                  <small className="welcome-date d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">rate_review</span>
                    Tu opinión es importante para mejorar nuestros servicios
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            {/* Botón para abrir modal de nuevo comentario */}
            <div className="mb-4">
              <button
                className="btn btn-primary btn-lg d-flex align-items-center"
                onClick={abrirModalComentario}
              >
                <span className="material-symbols-outlined me-2">add_comment</span>
                Dejar un nuevo comentario
              </button>
            </div>

            {/* Modal de feedback */}
            {showModal && (
              <div className="modal-overlay" onClick={cerrarModal}>
                <div className="modal-content-feedback" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close-btn" onClick={cerrarModal}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  
                  {!enviado ? (
                    <FeedbackFormulario
                      calificacion={calificacion}
                      calificacionHover={calificacionHover}
                      comentario={comentario}
                      loading={enviando}
                      onCalificacionChange={setCalificacion}
                      onHoverChange={setCalificacionHover}
                      onComentarioChange={setComentario}
                      onSubmit={enviarComentario}
                    />
                  ) : (
                    <FeedbackExito
                      calificacion={ultimaCalificacion ?? 0}
                      onNuevoComentario={nuevoComentario}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Lista de comentarios del paciente */}
            <div className="row">
              <div className="col-12">
                <h3 className="section-title mb-4">
                  <span className="material-symbols-outlined me-2">history</span>
                  Historial de Comentarios
                </h3>

                {loading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted">Cargando tus comentarios...</p>
                  </div>
                )}

                {!loading && (!misComentarios || misComentarios.length === 0) && (
                  <div className="text-center py-5">
                    <span className="material-symbols-outlined text-muted mb-3 empty-icon">
                      chat_bubble_outline
                    </span>
                    <h5 className="text-muted">No tienes comentarios aún</h5>
                    <p className="text-muted mb-3">Comparte tu experiencia dejando tu primer comentario</p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={abrirModalComentario}
                    >
                      <span className="material-symbols-outlined me-2">add</span>
                      Crear comentario
                    </button>
                  </div>
                )}

                {!loading && misComentarios && misComentarios.length > 0 && (
                  <>
                    <div className="row g-3">
                      {comentariosActuales.map((com) => (
                        <div key={com.idComentario} className="col-12">
                          <div className="comentario-card-paciente">
                            <div className="comentario-card-header-paciente">
                              <div className="d-flex align-items-center gap-3 flex-wrap">
                                <div className="comentario-avatar-paciente">
                                  <span className="material-symbols-outlined">person</span>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h6 className="mb-0 fw-bold">
                                      {userData.NombrePaciente} {userData.ApellidoPaciente}
                                    </h6>
                                    <span className={getEstadoBadge(com.IsPublicado)}>
                                      {getEstadoTexto(com.IsPublicado)}
                                    </span>
                                  </div>
                                  <small className="text-muted d-flex align-items-center mt-1">
                                    <span className="material-symbols-outlined me-1 icon-small">
                                      schedule
                                    </span>
                                    {formatearFecha(com.FechaComentario)}
                                  </small>
                                </div>
                                <div className="comentario-rating-paciente">
                                  {renderEstrellas(com.CalificacionComentario)}
                                </div>
                              </div>
                            </div>
                            <div className="comentario-card-body-paciente">
                              <p className="comentario-texto-paciente">{com.Comentario}</p>
                            </div>
                            {!com.IsPublicado && (
                              <div className="comentario-card-footer-paciente">
                                <small className="text-muted">
                                  <span className="material-symbols-outlined me-1 icon-small">
                                    info
                                  </span>
                                  Tu comentario está siendo revisado por nuestro equipo
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                      <div className="comentarios-paginacion">
                        <nav aria-label="Paginación de comentarios">
                          <ul className="pagination-comentarios">
                            <li className={`pagination-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                              <button
                                className="pagination-btn pagination-arrow"
                                onClick={() => cambiarPagina(paginaActual - 1)}
                                disabled={paginaActual === 1}
                                aria-label="Página anterior"
                              >
                                <span className="material-symbols-outlined icon-small">
                                  chevron_left
                                </span>
                              </button>
                            </li>
                            {[...Array(totalPaginas)].map((_, index) => (
                              <li
                                key={index + 1}
                                className={`pagination-item ${paginaActual === index + 1 ? 'active' : ''}`}
                              >
                                <button
                                  className="pagination-btn pagination-number"
                                  onClick={() => cambiarPagina(index + 1)}
                                  aria-label={`Ir a página ${index + 1}`}
                                  aria-current={paginaActual === index + 1 ? 'page' : undefined}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            ))}
                            <li className={`pagination-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                              <button
                                className="pagination-btn pagination-arrow"
                                onClick={() => cambiarPagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                                aria-label="Página siguiente"
                              >
                                <span className="material-symbols-outlined icon-small">
                                  chevron_right
                                </span>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
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
                      <span className="material-symbols-outlined me-2 text-primary">verified</span>
                      Información sobre comentarios
                    </h6>
                    <p className="card-text text-muted mb-0">
                      Todos los comentarios son revisados antes de publicarse en nuestra página principal.
                    </p>
                  </div>
                  <div className="col-md-4 col-12 text-md-end text-center mt-2 mt-md-0">
                    <small className="text-muted">
                      <span className="material-symbols-outlined me-1">shield</span>
                      Tu privacidad está protegida
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

export default ComentariosDelPaciente