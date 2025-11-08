import {useState, useEffect} from 'react'
import {obtenerPacientes, crearPaciente, actualizarPaciente, cambiarEstadoPaciente, obtenerLocalidades} from '../../../Custom/CustomPaciente.js'
import Swal from 'sweetalert2'
import '../../../Css/Admin/Pacientes/Pacientes.css' 
import PacientesHeader from './PacientesHeader'
import PacientesEstado from './PacientesEstado'
import PacientesFiltrar from './PacientesFiltrar'
import PacientesTabla from './PacientesTabla'
import PacientesModal from './PacientesModal'
import PacientesDetalleModal from './PacientesDetalleModal'
import PacientesPaginacion from './PacientesPaginacion'

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // crear o editar
  const [selectedPaciente, setSelectedPaciente] = useState(null)
  const [formData, setFormData] = useState({
    DNI: '',
    NombrePaciente: '',
    ApellidoPaciente: '',
    FechaNacPaciente: '',
    TelefonoPaciente: '',
    DireccionPaciente: '',
    Sexo: '',
    idLocalidad: 1, // Por defecto
    MailUsuario: '',
    PasswordUsuario: ''
  })
  const [filtro, setFiltro] = useState('todos') // 'todos', 'activos', 'inactivos'
  const [busqueda, setBusqueda] = useState('')
  // Estados para el modal de detalles
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [pacienteDetalle, setPacienteDetalle] = useState(null)
  // Estado para localidades
  const [localidades, setLocalidades] = useState([])
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const [pacientesPorPagina] = useState(10) // 10 pacientes por página

  // Cargar pacientes
  const fetchPacientes = async () => {
    try {
      setLoading(true)
      const data = await obtenerPacientes()
      setPacientes(data)
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar localidades
  const fetchLocalidades = async () => {
    try {
      const data = await obtenerLocalidades()
      setLocalidades(data)
    } catch (error) {
      console.error('Error al cargar localidades:', error)
      // Si falla, usar localidad por defecto
      setLocalidades([{ idLocalidad: 1, NombreLocalidad: 'Localidad por defecto' }])
    }
  }

  useEffect(() => {
    fetchPacientes()
    fetchLocalidades()
  }, [])

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter(paciente => {
    const matchBusqueda = paciente.NombrePaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         paciente.ApellidoPaciente?.toLowerCase().includes(busqueda.toLowerCase()) ||
                         paciente.DNI?.includes(busqueda)
    
    const matchFiltro = filtro === 'todos' || 
                       (filtro === 'activos' && paciente.IsActive) ||
                       (filtro === 'inactivos' && !paciente.IsActive)
    
    return matchBusqueda && matchFiltro
  })

  // Lógica de paginación
  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina)
  const indiceInicio = (paginaActual - 1) * pacientesPorPagina
  const indiceFin = indiceInicio + pacientesPorPagina
  const pacientesPaginados = pacientesFiltrados.slice(indiceInicio, indiceFin)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1)
  }, [filtro, busqueda])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Ver detalles completos del paciente
  const handleViewDetails = (paciente) => {
    // Usar los datos que ya vienen del backend con la información del usuario
    setPacienteDetalle(paciente)
    setShowDetalleModal(true)
  }



  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode('create')
    setFormData({
      DNI: '',
      NombrePaciente: '',
      ApellidoPaciente: '',
      FechaNacPaciente: '',
      TelefonoPaciente: '',
      DireccionPaciente: '',
      Sexo: '',
      idLocalidad: 1,
      MailUsuario: '',
      PasswordUsuario: ''
    })
    setShowModal(true)
  }

  // Abrir modal para editar
  const handleEdit = (paciente) => {
    setModalMode('edit')
    setSelectedPaciente(paciente)
    setFormData({
      DNI: paciente.DNI,
      NombrePaciente: paciente.NombrePaciente,
      ApellidoPaciente: paciente.ApellidoPaciente,
      FechaNacPaciente: paciente.FechaNacPaciente.split('T')[0], // Solo la fecha
      TelefonoPaciente: paciente.TelefonoPaciente,
      DireccionPaciente: paciente.DireccionPaciente,
      Sexo: paciente.Sexo,
      idLocalidad: paciente.idLocalidad || 1,
      MailUsuario: '',
      PasswordUsuario: ''
    })
    setShowModal(true)
  }

  // Guardar paciente (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === 'create') {
        await crearPaciente(formData)
        Swal.fire({
          title: '¡Paciente creado!',
          text: `El paciente "${formData.NombrePaciente} ${formData.ApellidoPaciente}" ha sido creado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      } else {
        // Para editar, no enviamos datos de usuario
        const { MailUsuario, PasswordUsuario, ...pacienteData } = formData
        await actualizarPaciente(selectedPaciente.idPaciente, pacienteData)
        Swal.fire({
          title: '¡Paciente actualizado!',
          text: `El paciente "${formData.NombrePaciente} ${formData.ApellidoPaciente}" ha sido actualizado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      }
      setShowModal(false)
      fetchPacientes()
    } catch (error) {
      console.error('Error al guardar paciente:', error)
      
      // Manejar errores específicos del backend
      let errorMessage = 'Hubo un problema al guardar el paciente. Por favor, inténtalo de nuevo.'
      let errorTitle = 'Error'
      
      if (error.response && error.response.data && error.response.data.message) {
        const backendError = error.response.data.message
        
        // Error de DNI duplicado
        if (backendError.includes('DNI ya está registrado')) {
          errorTitle = 'DNI duplicado'
          errorMessage = `El DNI "${formData.DNI}" ya está registrado. Por favor, verifica el número.`
        }

        // Error de email duplicado
        else if (backendError.includes('email ya está registrado')) {
          errorTitle = 'Email duplicado'
          errorMessage = `El email "${formData.MailUsuario}" ya está registrado.`
        }
        // Error de campos obligatorios
        else if (backendError.includes('Faltan datos obligatorios')) {
          errorTitle = 'Campos requeridos'
          errorMessage = 'Por favor, completa todos los campos obligatorios.'
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

  // Cambiar estado del paciente
  const handleToggleStatus = async (paciente) => {
    const isDeactivating = paciente.IsActive
    
    const result = await Swal.fire({
      title: isDeactivating ? '¿Desactivar paciente?' : '¿Activar paciente?',
      text: `¿Estás seguro de ${isDeactivating ? 'desactivar' : 'activar'} a "${paciente.NombrePaciente} ${paciente.ApellidoPaciente}"?`,
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
        await cambiarEstadoPaciente(paciente.idPaciente, nuevoEstado)
        fetchPacientes()
        
        Swal.fire({
          title: isDeactivating ? '¡Desactivado!' : '¡Activado!',
          text: `El paciente "${paciente.NombrePaciente} ${paciente.ApellidoPaciente}" ha sido ${isDeactivating ? 'desactivado' : 'activado'} correctamente.`,
          icon: 'success',
          confirmButtonColor: '#0470BB',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error) {
        console.error('Error al cambiar estado:', error)
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cambiar el estado del paciente. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#0470BB'
        })
      }
    }
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPaciente(null)
    setFormData({
      DNI: '',
      NombrePaciente: '',
      ApellidoPaciente: '',
      FechaNacPaciente: '',
      TelefonoPaciente: '',
      DireccionPaciente: '',
      Sexo: '',
      idLocalidad: 1,
      MailUsuario: '',
      PasswordUsuario: ''
    })
  }

  // Cerrar modal de detalles
  const handleCloseDetalleModal = () => {
    setShowDetalleModal(false)
    setPacienteDetalle(null)
  }

  // Manejar cambio de página
  const handleCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina)
  }

  return (
    <div className="pacientes-container">
      <PacientesHeader onCreateClick={handleCreate} />
      
      <PacientesEstado 
        pacientes={pacientes}
        pacientesFiltrados={pacientesFiltrados}
        filtro={filtro}
        onFiltroChange={setFiltro}
      />

      <PacientesFiltrar
        busqueda={busqueda}
        filtro={filtro}
        onBusquedaChange={setBusqueda}
        onFiltroChange={setFiltro}
      />

      <PacientesTabla
        pacientesFiltrados={pacientesPaginados}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onViewDetails={handleViewDetails}
      />

      <PacientesPaginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambioPagina={handleCambioPagina}
        totalRegistros={pacientesFiltrados.length}
        registrosPorPagina={pacientesPorPagina}
      />

      <PacientesModal
        showModal={showModal}
        modalMode={modalMode}
        formData={formData}
        pacientes={pacientes}
        localidades={localidades}
        selectedPaciente={selectedPaciente}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onClose={handleCloseModal}
      />

      <PacientesDetalleModal
        showModal={showDetalleModal}
        pacienteDetalle={pacienteDetalle}
        onClose={handleCloseDetalleModal}
      />
    </div>
  )
}

export default Pacientes
