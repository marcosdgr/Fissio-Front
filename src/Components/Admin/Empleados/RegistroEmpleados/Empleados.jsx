/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import useCustomEmpleados from '../../../../Custom/Empleados/CustomEmpleados'
import useCustomCatEmpleados from '../../../../Custom/Empleados/CustomCatEmpleados'
import { getLocalidades } from '../../../../Custom/CustomRegister'
import Swal from 'sweetalert2'
import '../../../../Css/Admin/Servicios/Servicios.css'
import '../../../../Css/Admin/Profesionales/Empleados.css'
import EstadisticasEmpleados from './EstadisticasEmpleados'
import FiltrosEmpleados from './FiltrosEmpleados'
import TablaEmpleados from './TablaEmpleados'
import ModalEmpleado from './ModalEmpleado'
import ModalVerEmpleado from './ModalVerEmpleado'

const Empleados = () => {
  const { empleados, loading, obtenerTodosLosEmpleados, crearEmpleado, editarEmpleado, cambiarEstadoEmpleado } = useCustomEmpleados()
  const { categorias, obtenerCategorias } = useCustomCatEmpleados()

  const [localidades, setLocalidades] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedEmpleado, setSelectedEmpleado] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewEmpleado, setViewEmpleado] = useState(null)
  const [formData, setFormData] = useState({
    DNI: '', NombreEmpleado: '', ApellidoEmpleado: '', FechaNacEmpleado: '', TelefonoEmpleado: '', DireccionEmpleado: '', idLocalidad: '', SalarioEmpleado: '', MailUsuario: '', PasswordUsuario: '', idCatEmpleado: '', PermisosEmpleado: ''
  })

  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        if (typeof obtenerTodosLosEmpleados === 'function') await obtenerTodosLosEmpleados()
        if (typeof obtenerCategorias === 'function') await obtenerCategorias()
        const data = await getLocalidades()
        setLocalidades(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error inicializando empleados/localidades/categorias', err)
        setLocalidades([])
      }
    })()
  }, [])

  const empleadosFiltrados = (empleados || []).filter(emp => {
    const q = busqueda.toLowerCase()
    const nombre = (emp.NombreEmpleado || '').toLowerCase()
    const apellido = (emp.ApellidoEmpleado || '').toLowerCase()
    const dni = (emp.DNI || '').toLowerCase()
    const matchBusqueda = !q || nombre.includes(q) || apellido.includes(q) || dni.includes(q)
    const matchFiltro = filtro === 'todos' || (filtro === 'activos' && emp.IsActive) || (filtro === 'inactivos' && !emp.IsActive)
    return matchBusqueda && matchFiltro
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const dniYaExiste = (dni) => {
    const d = (dni || '').toLowerCase().trim()
    return (empleados || []).some(emp => {
      if (modalMode === 'edit' && (emp.idEmpleado ?? emp.id) === (selectedEmpleado?.idEmpleado ?? selectedEmpleado?.id)) return false
      return (emp.DNI || '').toLowerCase().trim() === d
    })
  }

  const handleCreate = () => {
    setModalMode('create')
    setFormData({ DNI: '', NombreEmpleado: '', ApellidoEmpleado: '', FechaNacEmpleado: '', TelefonoEmpleado: '', DireccionEmpleado: '', idLocalidad: '', SalarioEmpleado: '', MailUsuario: '', PasswordUsuario: '', idCatEmpleado: '', PermisosEmpleado: '' })
    setSelectedEmpleado(null)
    setShowModal(true)
  }

  const handleEdit = (emp) => {
    setModalMode('edit')
    setSelectedEmpleado(emp)
    setFormData({
      DNI: emp.DNI || '', NombreEmpleado: emp.NombreEmpleado || '', ApellidoEmpleado: emp.ApellidoEmpleado || '', FechaNacEmpleado: emp.FechaNacEmpleado ? emp.FechaNacEmpleado.split('T')?.[0] ?? emp.FechaNacEmpleado : '', TelefonoEmpleado: emp.TelefonoEmpleado || '', DireccionEmpleado: emp.DireccionEmpleado || '', idLocalidad: emp.idLocalidad ?? '', SalarioEmpleado: emp.SalarioEmpleado ?? '', MailUsuario: emp.MailUsuario || '', PasswordUsuario: '', idCatEmpleado: emp.idCatEmpleado ?? '', PermisosEmpleado: emp.PermisosEmpleado ?? ''
    })
    setShowModal(true)
  }

  const handleView = async (emp) => {
    try {
      setViewEmpleado(emp)
      setShowViewModal(true)
    } catch (err) {
      console.error('Error al ver empleado', err)
      setViewEmpleado(emp)
      setShowViewModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEmpleado(null)
    setFormData({ DNI: '', NombreEmpleado: '', ApellidoEmpleado: '', FechaNacEmpleado: '', TelefonoEmpleado: '', DireccionEmpleado: '', idLocalidad: '', SalarioEmpleado: '', MailUsuario: '', PasswordUsuario: '', idCatEmpleado: '' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.DNI.trim() || !formData.NombreEmpleado.trim() || !formData.ApellidoEmpleado.trim() || !formData.FechaNacEmpleado || !formData.SalarioEmpleado || !formData.idCatEmpleado) {
      Swal.fire({ title: 'Campos requeridos', text: 'Completa los campos obligatorios (DNI, Nombre, Apellido, Fecha Nac., Salario, Categoría).', icon: 'warning', confirmButtonColor: '#0470BB' })
      return
    }
    if (dniYaExiste(formData.DNI)) {
      Swal.fire({ title: 'DNI duplicado', text: `El DNI ${formData.DNI} ya está registrado.`, icon: 'error', confirmButtonColor: '#0470BB' })
      return
    }

    try {
      if (modalMode === 'create') {
        const payload = {
          MailUsuario: formData.MailUsuario || undefined,
          PasswordUsuario: formData.PasswordUsuario || undefined,
          DNI: formData.DNI,
          NombreEmpleado: formData.NombreEmpleado,
          ApellidoEmpleado: formData.ApellidoEmpleado,
          FechaNacEmpleado: formData.FechaNacEmpleado,
          TelefonoEmpleado: formData.TelefonoEmpleado || null,
          DireccionEmpleado: formData.DireccionEmpleado || null,
          SalarioEmpleado: parseFloat(formData.SalarioEmpleado) || 0,
          idLocalidad: formData.idLocalidad ? parseInt(formData.idLocalidad) : null,
            idCatEmpleado: formData.idCatEmpleado ? parseInt(formData.idCatEmpleado) : null,
            PermisosEmpleado: formData.PermisosEmpleado || null
        }
        await crearEmpleado(payload)
        Swal.fire({ title: 'Empleado creado', text: `Empleado ${formData.NombreEmpleado} creado correctamente.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1500, timerProgressBar: true })
      } else {
        const id = selectedEmpleado?.idEmpleado ?? selectedEmpleado?.id
        const payload = {
          DNI: formData.DNI,
          NombreEmpleado: formData.NombreEmpleado,
          ApellidoEmpleado: formData.ApellidoEmpleado,
          FechaNacEmpleado: formData.FechaNacEmpleado,
          TelefonoEmpleado: formData.TelefonoEmpleado || null,
          DireccionEmpleado: formData.DireccionEmpleado || null,
          SalarioEmpleado: parseFloat(formData.SalarioEmpleado) || 0,
          idLocalidad: formData.idLocalidad ? parseInt(formData.idLocalidad) : null,
          idCatEmpleado: formData.idCatEmpleado ? parseInt(formData.idCatEmpleado) : null,
          PermisosEmpleado: formData.PermisosEmpleado || null,
          MailUsuario: formData.MailUsuario || undefined
        }
        console.log('Payload enviado:', payload)
        console.log('ID empleado:', id)
        await editarEmpleado(id, payload)
        Swal.fire({ title: 'Empleado actualizado', text: `Empleado ${formData.NombreEmpleado} actualizado correctamente.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1500, timerProgressBar: true })
      }
      handleCloseModal()
      obtenerTodosLosEmpleados()
    } catch (err) {
      console.error('Error al guardar empleado', err)
      let message = 'Error al guardar. Revisa los datos e intenta de nuevo.'
      if (err?.response?.data?.message) message = err.response.data.message
      Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonColor: '#0470BB' })
    }
  }

  const handleToggleStatus = async (emp) => {
    const isDeactivating = emp.IsActive
    const result = await Swal.fire({
      title: isDeactivating ? '¿Desactivar empleado?' : '¿Activar empleado?',
      text: `¿Estás seguro de ${isDeactivating ? 'desactivar' : 'activar'} ${emp.NombreEmpleado} ${emp.ApellidoEmpleado}?`,
      icon: isDeactivating ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isDeactivating ? '#dc3545' : '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: isDeactivating ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })
    if (!result.isConfirmed) return
    try {
      const nuevoEstado = isDeactivating ? 0 : 1
      const id = emp.idEmpleado ?? emp.id
      await cambiarEstadoEmpleado(id, nuevoEstado)
      obtenerTodosLosEmpleados()
      Swal.fire({ title: isDeactivating ? 'Desactivado' : 'Activado', text: `El empleado fue ${isDeactivating ? 'desactivado' : 'activado'}.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1200, timerProgressBar: true })
    } catch (err) {
      console.error('Error al cambiar estado', err)
      Swal.fire({ title: 'Error', text: 'No se pudo cambiar el estado. Intenta de nuevo.', icon: 'error', confirmButtonColor: '#0470BB' })
    }
  }

  return (
    <div className="servicios-container">
      <div className="servicios-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="servicios-title"><span className="material-symbols-outlined me-2">badge</span>Gestión de Empleados</h2>
            <p className="servicios-subtitle">Crear, editar y activar/desactivar empleados</p>
          </div>
          <button className="btn btn-fissio-primary" onClick={handleCreate}><span className="material-symbols-outlined me-1">add</span>Nuevo Empleado</button>
        </div>

        <EstadisticasEmpleados total={(empleados || []).length} activos={(empleados || []).filter(e => e.IsActive).length} inactivos={(empleados || []).filter(e => !e.IsActive).length} filtro={filtro} setFiltro={setFiltro} />
      </div>

      <FiltrosEmpleados busqueda={busqueda} setBusqueda={setBusqueda} filtro={filtro} setFiltro={setFiltro} />

      <TablaEmpleados empleados={empleadosFiltrados} loading={loading} onView={handleView} onEdit={handleEdit} onToggle={handleToggleStatus} />

      <ModalEmpleado showModal={showModal} modalMode={modalMode} formData={formData} handleInputChange={handleInputChange} handleSave={handleSave} handleCloseModal={handleCloseModal} dniYaExiste={dniYaExiste} localidades={localidades} categorias={categorias} />

      <ModalVerEmpleado showViewModal={showViewModal} viewEmpleado={viewEmpleado} onClose={() => { setShowViewModal(false); setViewEmpleado(null) }} />
    </div>
  )
}

export default Empleados
