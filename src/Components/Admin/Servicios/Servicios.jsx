import {useState, useEffect} from 'react'
import {obtenerServicios, crearServicio, actualizarServicio, cambiarEstadoServicio} from '../../../Custom/CustomServicios'
import Swal from 'sweetalert2'
import '../../../Css/Admin/Servicios/Servicios.css'
import ServiciosHeader from './ServiciosHeader'
import ServiciosEstado from './ServiciosEstado'
import ServiciosFiltrar from './ServiciosFiltrar'
import ServiciosTabla from './ServiciosTabla'
import ServiciosModal from './ServiciosModal'

const Servicios = () => {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') 
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [formData, setFormData] = useState({
    NombreServicio: '',
    DescripcionServicio: ''
  })
  const [filtro, setFiltro] = useState('todos') 
  const [busqueda, setBusqueda] = useState('')

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

  const serviciosFiltrados = servicios.filter(servicio => {
    const matchBusqueda = servicio.NombreServicio?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         servicio.DescripcionServicio?.toLowerCase().includes(busqueda.toLowerCase())
    
    const matchFiltro = filtro === 'todos' || 
                       (filtro === 'activos' && servicio.IsActive) ||
                       (filtro === 'inactivos' && !servicio.IsActive)
    
    return matchBusqueda && matchFiltro
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreate = () => {
    setModalMode('create')
    setFormData({ NombreServicio: '', DescripcionServicio: '' })
    setShowModal(true)
  }

  const handleEdit = (servicio) => {
    setModalMode('edit')
    setSelectedServicio(servicio)
    setFormData({
      NombreServicio: servicio.NombreServicio,
      DescripcionServicio: servicio.DescripcionServicio
    })
    setShowModal(true)
  }

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

      let errorMessage = 'Hubo un problema al guardar el servicio. Por favor, inténtalo de nuevo.'
      let errorTitle = 'Error'
      
      if (error.response && error.response.data && error.response.data.error) {
        const backendError = error.response.data.error

        if (backendError.includes('Ya existe un servicio con ese nombre') || 
            backendError.includes('Ya existe otro servicio con ese nombre')) {
          errorTitle = 'Nombre duplicado'
          errorMessage = `El nombre "${formData.NombreServicio}" ya está en uso. Por favor, elige un nombre diferente.`
        }

        else if (backendError.includes('obligatorio')) {
          errorTitle = 'Campo requerido'
          errorMessage = 'El nombre del servicio es obligatorio y no puede estar vacío.'
        }
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

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedServicio(null)
    setFormData({ NombreServicio: '', DescripcionServicio: '' })
  }

  return (
    <div className="servicios-container">
      <ServiciosHeader onCreateClick={handleCreate} />
      
      <ServiciosEstado 
        servicios={servicios}
        filtro={filtro}
        onFiltroChange={setFiltro}
      />

      <ServiciosFiltrar
        busqueda={busqueda}
        filtro={filtro}
        onBusquedaChange={setBusqueda}
        onFiltroChange={setFiltro}
      />

      <ServiciosTabla
        serviciosFiltrados={serviciosFiltrados}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <ServiciosModal
        showModal={showModal}
        modalMode={modalMode}
        formData={formData}
        servicios={servicios}
        selectedServicio={selectedServicio}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default Servicios