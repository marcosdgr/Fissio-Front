import {useState, useEffect} from 'react'
import {obtenerServicios, crearServicio, actualizarServicio, cambiarEstadoServicio} from '../../../Custom/CustomServicios'
import Swal from 'sweetalert2'
import '../../../Css/Admin/Servicios/Servicios.css'

const Servicios = () => {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // crear o editar
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [formData, setFormData] = useState({
    NombreServicio: '',
    DescripcionServicio: ''
  })
  const [filtro, setFiltro] = useState('todos') // 'todos', 'activos', 'inactivos'
  const [busqueda, setBusqueda] = useState('')

  // Cargar servicios
  const fetchServicios = async () => {
    try {
      setLoading(true)
      const data = await obtenerServicios()
      setServicios(data)
    } catch (error) {
      console.error('Error al cargar servicios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServicios()
  }, [])

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter(servicio => {
    const matchBusqueda = servicio.NombreServicio?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         servicio.DescripcionServicio?.toLowerCase().includes(busqueda.toLowerCase())
    
    const matchFiltro = filtro === 'todos' || 
                       (filtro === 'activos' && servicio.IsActive) ||
                       (filtro === 'inactivos' && !servicio.IsActive)
    
    return matchBusqueda && matchFiltro
  })

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validar si el nombre ya existe (sin considerar mayúsculas/minúsculas)
  const nombreYaExiste = (nombre) => {
    const nombreLower = nombre.toLowerCase().trim()
    return servicios.some(servicio => {
      // Si estamos editando, excluir el servicio actual
      if (modalMode === 'edit' && servicio.idServicio === selectedServicio?.idServicio) {
        return false
      }
      return servicio.NombreServicio.toLowerCase() === nombreLower
    })
  }

  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode('create')
    setFormData({ NombreServicio: '', DescripcionServicio: '' })
    setShowModal(true)
  }

  // Abrir modal para editar
  const handleEdit = (servicio) => {
    setModalMode('edit')
    setSelectedServicio(servicio)
    setFormData({
      NombreServicio: servicio.NombreServicio,
      DescripcionServicio: servicio.DescripcionServicio
    })
    setShowModal(true)
  }

  // Guardar servicio (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === 'create') {
        await crearServicio(formData)
        Swal.fire({
          title: '¡Servicio creado!',
          text: `El servicio "${formData.NombreServicio}" ha sido creado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        await actualizarServicio(selectedServicio.idServicio, formData)
        Swal.fire({
          title: '¡Servicio actualizado!',
          text: `El servicio "${formData.NombreServicio}" ha sido actualizado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      }
      setShowModal(false)
      fetchServicios()
    } catch (error) {
      console.error('Error al guardar servicio:', error)
      
      // Manejar errores específicos del backend
      let errorMessage = 'Hubo un problema al guardar el servicio. Por favor, inténtalo de nuevo.'
      let errorTitle = 'Error'
      
      if (error.response && error.response.data && error.response.data.error) {
        const backendError = error.response.data.error
        
        // Error de nombre duplicado
        if (backendError.includes('Ya existe un servicio con ese nombre') || 
            backendError.includes('Ya existe otro servicio con ese nombre')) {
          errorTitle = 'Nombre duplicado'
          errorMessage = `El nombre "${formData.NombreServicio}" ya está en uso. Por favor, elige un nombre diferente.`
        }
        // Error de campo obligatorio
        else if (backendError.includes('obligatorio')) {
          errorTitle = 'Campo requerido'
          errorMessage = 'El nombre del servicio es obligatorio y no puede estar vacío.'
        }
        // Otros errores específicos del backend
        else {
          errorMessage = backendError
        }
      }
      
      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#0470BB',
        confirmButtonText: 'Entendido'
      })
    }
  }

  // Cambiar estado del servicio
  const handleToggleStatus = async (servicio) => {
    const isDeactivating = servicio.IsActive
    
    const result = await Swal.fire({
      title: isDeactivating ? '¿Desactivar servicio?' : '¿Activar servicio?',
      text: `¿Estás seguro de ${isDeactivating ? 'desactivar' : 'activar'} "${servicio.NombreServicio}"?`,
      icon: isDeactivating ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isDeactivating ? '#dc3545' : '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: isDeactivating ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      try {
        // Enviar 0 para desactivar, 1 para activar
        const nuevoEstado = isDeactivating ? 0 : 1
        await cambiarEstadoServicio(servicio.idServicio, nuevoEstado)
        fetchServicios()
        
        Swal.fire({
          title: isDeactivating ? '¡Desactivado!' : '¡Activado!',
          text: `El servicio "${servicio.NombreServicio}" ha sido ${isDeactivating ? 'desactivado' : 'activado'} correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error) {
        console.error('Error al cambiar estado:', error)
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cambiar el estado del servicio. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#0470BB'
        })
      }
    }
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedServicio(null)
    setFormData({ NombreServicio: '', DescripcionServicio: '' })
  }

  return (
    <div className="servicios-container">
      {/* Header */}
      <div className="servicios-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="servicios-title">
              <span className="material-symbols-outlined me-2">medical_services</span>
              Gestión de Servicios
            </h2>
            <p className="servicios-subtitle">Administra los servicios de kinesiología</p>
          </div>
          <button className="btn btn-fissio-primary" onClick={handleCreate}>
            <span className="material-symbols-outlined me-1">add</span>
            Nuevo Servicio
          </button>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div 
              className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltro('todos')}
              title="Clic para ver todos los servicios"
            >
              <div className="card-body">
                <h5 className="stats-value">{servicios.length}</h5>
                <p className="stats-title">Total Servicios</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`}
              onClick={() => setFiltro('activos')}
              title="Clic para ver solo servicios activos"
            >
              <div className="card-body">
                <h5 className="stats-value text-success">{servicios.filter(s => s.IsActive).length}</h5>
                <p className="stats-title">Activos</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div 
              className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`}
              onClick={() => setFiltro('inactivos')}
              title="Clic para ver solo servicios inactivos"
            >
              <div className="card-body">
                <h5 className="stats-value text-danger">{servicios.filter(s => !s.IsActive).length}</h5>
                <p className="stats-title">Inactivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="servicios-filters">
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar servicios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">🔍 Todos los servicios</option>
              <option value="activos">✅ Solo activos</option>
              <option value="inactivos">❌ Solo inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="servicios-table">
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviciosFiltrados.length > 0 ? (
                      serviciosFiltrados.map(servicio => (
                        <tr key={servicio.idServicio}>
                          <td className="fw-medium">{servicio.NombreServicio}</td>
                          <td>{servicio.DescripcionServicio}</td>
                          <td>
                            <span className={`badge ${servicio.IsActive ? 'bg-success' : 'bg-danger'}`}>
                              {servicio.IsActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(servicio)}
                                title="Editar servicio"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button 
                                className={`btn btn-sm ${servicio.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                onClick={() => handleToggleStatus(servicio)}
                                title={servicio.IsActive ? 'Desactivar servicio' : 'Activar servicio'}
                              >
                                {servicio.IsActive ? (
                                  <span className="material-symbols-outlined">block</span>
                                ) : (
                                  <span className="material-symbols-outlined">check_circle</span>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <span className="material-symbols-outlined fs-1 text-muted">medical_services</span>
                          <p className="text-muted mt-2">No hay servicios que coincidan con los filtros</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <span className="material-symbols-outlined me-2">medical_services</span>
                  {modalMode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="NombreServicio" className="form-label">
                        Nombre del Servicio *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formData.NombreServicio && nombreYaExiste(formData.NombreServicio) ? 'is-invalid' : ''}`}
                        id="NombreServicio"
                        name="NombreServicio"
                        value={formData.NombreServicio}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Rehabilitación de rodilla"
                      />
                      {formData.NombreServicio && nombreYaExiste(formData.NombreServicio) && (
                        <div className="invalid-feedback">
                          <i className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>error</i>
                          Este nombre ya está en uso. Por favor, elige uno diferente.
                        </div>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="DescripcionServicio" className="form-label">
                        Descripción del Servicio *
                      </label>
                      <textarea
                        className="form-control"
                        id="DescripcionServicio"
                        name="DescripcionServicio"
                        rows="4"
                        value={formData.DescripcionServicio}
                        onChange={handleInputChange}
                        required
                        placeholder="Describe el servicio de kinesiología..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-fissio-primary"
                    disabled={!formData.NombreServicio.trim() || nombreYaExiste(formData.NombreServicio)}
                  >
                    <span className="material-symbols-outlined me-1">save</span>
                    {modalMode === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Servicios