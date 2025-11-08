import { useState, useEffect } from 'react'
import useCustomEmpleados from '../../../../Custom/Empleados/CustomEmpleados'
import useCustomCatEmpleados from '../../../../Custom/Empleados/CustomCatEmpleados'
import { getLocalidades } from '../../../../Custom/CustomRegister'
import Swal from 'sweetalert2'
import '../../../../Css/Admin/Servicios/Servicios.css'
import '../../../../Css/Admin/Profesionales/Empleados.css'

const Empleados = () => {
  const { empleados, loading, obtenerEmpleados, obtenerEmpleadoPorId, crearEmpleado, actualizarEmpleado, cambiarEstadoEmpleado } = useCustomEmpleados()
  const { categorias, obtenerCategorias } = useCustomCatEmpleados()

  const [localidades, setLocalidades] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedEmpleado, setSelectedEmpleado] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewEmpleado, setViewEmpleado] = useState(null)
  const [formData, setFormData] = useState({
    DNI: '', NombreEmpleado: '', ApellidoEmpleado: '', FechaNacEmpleado: '', TelefonoEmpleado: '', DireccionEmpleado: '', idLocalidad: '', SalarioEmpleado: '', MailUsuario: '', PasswordUsuario: '', idCatEmpleado: ''
  })

  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        if (typeof obtenerEmpleados === 'function') {
          await obtenerEmpleados()
        } else {
          console.warn('obtenerEmpleados no es una función:', obtenerEmpleados)
        }
        if (typeof obtenerCategorias === 'function') {
          await obtenerCategorias()
        }
        const data = await getLocalidades()
        setLocalidades(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error inicializando empleados/localidades/categorias', err)
        setLocalidades([])
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setFormData({ DNI: '', NombreEmpleado: '', ApellidoEmpleado: '', FechaNacEmpleado: '', TelefonoEmpleado: '', DireccionEmpleado: '', idLocalidad: '', SalarioEmpleado: '', MailUsuario: '', PasswordUsuario: '', idCatEmpleado: '' })
    setSelectedEmpleado(null)
    setShowModal(true)
  }

  const handleEdit = (emp) => {
    setModalMode('edit')
    setSelectedEmpleado(emp)
    setFormData({
      DNI: emp.DNI || '', NombreEmpleado: emp.NombreEmpleado || '', ApellidoEmpleado: emp.ApellidoEmpleado || '', FechaNacEmpleado: emp.FechaNacEmpleado ? emp.FechaNacEmpleado.split('T')?.[0] ?? emp.FechaNacEmpleado : '', TelefonoEmpleado: emp.TelefonoEmpleado || '', DireccionEmpleado: emp.DireccionEmpleado || '', idLocalidad: emp.idLocalidad ?? '', SalarioEmpleado: emp.SalarioEmpleado ?? '', MailUsuario: emp.MailUsuario || '', PasswordUsuario: '', idCatEmpleado: emp.idCatEmpleado ?? ''
    })
    setShowModal(true)
  }

  const handleView = async (emp) => {
    try {
      const id = emp.idEmpleado ?? emp.id
      if (!id) {
        setViewEmpleado(emp)
        setShowViewModal(true)
        return
      }
      const full = await obtenerEmpleadoPorId(id)
      setViewEmpleado(full || emp)
    } catch (err) {
      console.error('Error fetching empleado for view', err)
      setViewEmpleado(emp)
    } finally {
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
    // validations
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
          idCatEmpleado: formData.idCatEmpleado ? parseInt(formData.idCatEmpleado) : null
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
          MailUsuario: formData.MailUsuario || undefined
        }
        await actualizarEmpleado(id, payload)
        Swal.fire({ title: 'Empleado actualizado', text: `Empleado ${formData.NombreEmpleado} actualizado correctamente.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1500, timerProgressBar: true })
      }
      handleCloseModal()
      obtenerEmpleados()
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
      obtenerEmpleados()
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

        <div className="row mb-4">
          <div className="col-md-4">
            <div className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')} title="Ver todos">
              <div className="card-body"><h5 className="stats-value">{(empleados || []).length}</h5><p className="stats-title">Total Empleados</p></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`} onClick={() => setFiltro('activos')} title="Activos">
              <div className="card-body"><h5 className="stats-value text-success">{(empleados || []).filter(e => e.IsActive).length}</h5><p className="stats-title">Activos</p></div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`} onClick={() => setFiltro('inactivos')} title="Inactivos">
              <div className="card-body"><h5 className="stats-value text-danger">{(empleados || []).filter(e => !e.IsActive).length}</h5><p className="stats-title">Inactivos</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="servicios-filters">
        <div className="row mb-3">
          <div className="col-md-6"><div className="input-group"><span className="input-group-text"><span className="material-symbols-outlined">search</span></span><input type="text" className="form-control" placeholder="Buscar por DNI, nombre o apellido..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div></div>
          <div className="col-md-3"><select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}><option value="todos">🔍 Todos</option><option value="activos">✅ Solo activos</option><option value="inactivos">❌ Solo inactivos</option></select></div>
        </div>
      </div>

      <div className="servicios-table">
        <div className="card"><div className="card-body">
          {loading ? (<div className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>) : (
            <div className="table-responsive"><table className="table table-hover"><thead className="table-light"><tr><th>DNI</th><th>Nombre</th><th>Apellido</th><th>Localidad</th><th>Categoría</th><th>Salario</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
              {empleadosFiltrados.length > 0 ? empleadosFiltrados.map(emp => (
                <tr key={emp.idEmpleado ?? emp.id}><td className="fw-medium">{emp.DNI}</td><td>{emp.NombreEmpleado}</td><td>{emp.ApellidoEmpleado}</td><td>{emp.NombreLocalidad || '-'}</td><td>{emp.NombreCat || '-'}</td><td>{emp.SalarioEmpleado}</td><td><span className={`badge ${emp.IsActive ? 'bg-success' : 'bg-danger'}`}>{emp.IsActive ? 'Activo' : 'Inactivo'}</span></td><td><div className="d-flex gap-1"><button className="btn btn-sm btn-outline-secondary" onClick={() => handleView(emp)} title="Ver"><span className="material-symbols-outlined">visibility</span></button><button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(emp)} title="Editar"><span className="material-symbols-outlined">edit</span></button><button className={`btn btn-sm ${emp.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => handleToggleStatus(emp)} title={emp.IsActive ? 'Desactivar' : 'Activar'}>{emp.IsActive ? <span className="material-symbols-outlined">block</span> : <span className="material-symbols-outlined">check_circle</span>}</button></div></td></tr>
              )) : (<tr><td colSpan="8" className="text-center py-4"><span className="material-symbols-outlined fs-1 text-muted">badge</span><p className="text-muted mt-2">No hay empleados que coincidan con los filtros</p></td></tr>)}
            </tbody></table></div>
          )}
        </div></div>
      </div>

      {showModal && (
        <div className="modal fade show d-block modal-backdrop-custom">
          <div className="modal-dialog modal-lg"><div className="modal-content"><div className="modal-header"><h5 className="modal-title"><span className="material-symbols-outlined me-2">badge</span>{modalMode === 'create' ? 'Nuevo Empleado' : 'Editar Empleado'}</h5><button type="button" className="btn-close" onClick={handleCloseModal}></button></div>
            <form onSubmit={handleSave}><div className="modal-body"><div className="row">
              <div className="col-md-4 mb-3"><label className="form-label">DNI *</label><input name="DNI" className={`form-control ${formData.DNI && dniYaExiste(formData.DNI) ? 'is-invalid' : ''}`} value={formData.DNI} onChange={handleInputChange} required /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Nombre *</label><input name="NombreEmpleado" className="form-control" value={formData.NombreEmpleado} onChange={handleInputChange} required /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Apellido *</label><input name="ApellidoEmpleado" className="form-control" value={formData.ApellidoEmpleado} onChange={handleInputChange} required /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Fecha Nac. *</label><input type="date" name="FechaNacEmpleado" className="form-control" value={formData.FechaNacEmpleado} onChange={handleInputChange} required /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Teléfono</label><input name="TelefonoEmpleado" className="form-control" value={formData.TelefonoEmpleado} onChange={handleInputChange} /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Dirección</label><input name="DireccionEmpleado" className="form-control" value={formData.DireccionEmpleado} onChange={handleInputChange} /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Localidad</label><select name="idLocalidad" className="form-select" value={formData.idLocalidad} onChange={handleInputChange}><option value="">Seleccionar</option>{localidades.map(loc => <option key={loc.idLocalidad ?? loc.id} value={loc.idLocalidad ?? loc.id}>{loc.NombreLocalidad ?? loc.nombre}</option>)}</select></div>
              <div className="col-md-4 mb-3"><label className="form-label">Categoría *</label><select name="idCatEmpleado" className="form-select" value={formData.idCatEmpleado} onChange={handleInputChange} required><option value="">Seleccionar</option>{(categorias||[]).map(cat => <option key={cat.idCatEmpleado ?? cat.id} value={cat.idCatEmpleado ?? cat.id}>{cat.NombreCat || cat.NombreCategoria}</option>)}</select></div>
              <div className="col-md-4 mb-3"><label className="form-label">Salario *</label><input type="number" step="0.01" name="SalarioEmpleado" className="form-control" value={formData.SalarioEmpleado} onChange={handleInputChange} required /></div>
              <div className="col-md-4 mb-3"><label className="form-label">Mail (opcional)</label><input name="MailUsuario" className="form-control" value={formData.MailUsuario} onChange={handleInputChange} /></div>
              {modalMode === 'create' && (<div className="col-md-4 mb-3"><label className="form-label">Password (si crea usuario)</label><input type="password" name="PasswordUsuario" className="form-control" value={formData.PasswordUsuario} onChange={handleInputChange} /></div>)}
            </div></div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button><button type="submit" className="btn btn-fissio-primary" disabled={!formData.DNI.trim() || !formData.NombreEmpleado.trim() || !formData.ApellidoEmpleado.trim() || !formData.SalarioEmpleado || !formData.idCatEmpleado || (formData.DNI && dniYaExiste(formData.DNI))}><span className="material-symbols-outlined me-1">save</span>{modalMode === 'create' ? 'Crear Empleado' : 'Guardar cambios'}</button></div></form>
          </div></div></div>
      )}
      {showViewModal && (
        <div className="modal fade show d-block modal-backdrop-custom">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><span className="material-symbols-outlined me-2">badge</span>Detalle del Empleado</h5>
                <button type="button" className="btn-close" onClick={() => { setShowViewModal(false); setViewEmpleado(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 mb-2"><strong>DNI</strong><div>{viewEmpleado?.DNI ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Nombre</strong><div>{viewEmpleado?.NombreEmpleado ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Apellido</strong><div>{viewEmpleado?.ApellidoEmpleado ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Fecha Nac.</strong><div>{viewEmpleado?.FechaNacEmpleado ? String(viewEmpleado.FechaNacEmpleado).split('T')?.[0] ?? viewEmpleado.FechaNacEmpleado : '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Teléfono</strong><div>{viewEmpleado?.TelefonoEmpleado ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Dirección</strong><div>{viewEmpleado?.DireccionEmpleado ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Localidad</strong><div>{viewEmpleado?.NombreLocalidad ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Categoría</strong><div>{viewEmpleado?.NombreCat ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Salario</strong><div>{viewEmpleado?.SalarioEmpleado ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Mail</strong><div>{viewEmpleado?.MailUsuario ?? '-'}</div></div>
                  <div className="col-md-4 mb-2"><strong>Estado</strong><div><span className={`badge ${viewEmpleado?.IsActive ? 'bg-success' : 'bg-danger'}`}>{viewEmpleado?.IsActive ? 'Activo' : 'Inactivo'}</span></div></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowViewModal(false); setViewEmpleado(null); }}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Empleados
