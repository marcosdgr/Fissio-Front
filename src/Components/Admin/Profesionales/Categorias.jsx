import { useState, useEffect } from 'react'
import useCustomCatEmpleados from '../../../Custom/Empleados/CustomCatEmpleados'
import Swal from 'sweetalert2'
import '../../../Css/Admin/Servicios/Servicios.css'
import '../../../Css/Admin/Profesionales/Categorias.css'

const Categorias = () => {
	const { categorias, loading, obtenerCategorias, crearCategoria, editarCategoria, cambiarEstadoCategoria } = useCustomCatEmpleados()

	const [showModal, setShowModal] = useState(false)
	const [modalMode, setModalMode] = useState('create') 
	const [selectedCategoria, setSelectedCategoria] = useState(null)
	const [formData, setFormData] = useState({ NombreCategoria: '', DescripcionCategoria: '' })
	const [filtro, setFiltro] = useState('todos')
	const [busqueda, setBusqueda] = useState('')

	useEffect(() => {
		obtenerCategorias()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const categoriasFiltradas = (categorias || []).filter(cat => {
		const nombre = (cat.NombreCat || cat.NombreCategoria || '').toLowerCase()
		const descripcion = (cat.DescripcionCat || cat.DescripcionCategoria || '').toLowerCase()
		const q = busqueda.toLowerCase()
		const matchBusqueda = !q || nombre.includes(q) || descripcion.includes(q)
		const matchFiltro = filtro === 'todos' || (filtro === 'activos' && cat.IsActive) || (filtro === 'inactivos' && !cat.IsActive)
		return matchBusqueda && matchFiltro
	})

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const nombreYaExiste = (nombre) => {
		const n = nombre.toLowerCase().trim()
		return (categorias || []).some(cat => {
			if (modalMode === 'edit' && (cat.idCatEmpleado ?? cat.id) === (selectedCategoria?.idCatEmpleado ?? selectedCategoria?.id)) return false
			const existing = (cat.NombreCat || cat.NombreCategoria || '').toLowerCase().trim()
			return existing === n
		})
	}

	const handleCreate = () => {
		setModalMode('create')
		setFormData({ NombreCategoria: '', DescripcionCategoria: '' })
		setSelectedCategoria(null)
		setShowModal(true)
	}

	const handleEdit = (cat) => {
		setModalMode('edit')
		setSelectedCategoria(cat)
		setFormData({ NombreCategoria: cat.NombreCat || cat.NombreCategoria || '', DescripcionCategoria: cat.DescripcionCat || cat.DescripcionCategoria || '' })
		setShowModal(true)
	}

	const handleCloseModal = () => {
		setShowModal(false)
		setSelectedCategoria(null)
		setFormData({ NombreCategoria: '', DescripcionCategoria: '' })
	}

	const handleSave = async (e) => {
		e.preventDefault()
		const nombre = (formData.NombreCategoria || '').trim()
		if (!nombre) {
			Swal.fire({ title: 'Nombre requerido', text: 'El nombre de la categoría es obligatorio.', icon: 'warning', confirmButtonColor: '#0470BB' })
			return
		}
		if (nombreYaExiste(nombre)) {
			Swal.fire({ title: 'Nombre duplicado', text: `El nombre "${nombre}" ya existe.`, icon: 'error', confirmButtonColor: '#0470BB' })
			return
		}

		try {
			if (modalMode === 'create') {
				const payload = { NombreCategoria: nombre, DescripcionCategoria: formData.DescripcionCategoria }
				await crearCategoria(payload)
				Swal.fire({ title: 'Categoría creada', text: `La categoría "${nombre}" se creó correctamente.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1600, timerProgressBar: true })
			} else {
				const id = selectedCategoria?.idCatEmpleado ?? selectedCategoria?.id
				const payload = { NombreCategoria: nombre, DescripcionCategoria: formData.DescripcionCategoria }
				await editarCategoria(id, payload)
				Swal.fire({ title: 'Categoría actualizada', text: `La categoría "${nombre}" se actualizó correctamente.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1600, timerProgressBar: true })
			}
			handleCloseModal()
			obtenerCategorias()
		} catch (err) {
			console.error('Error al guardar categoría', err)
			let message = 'Hubo un error al guardar la categoría. Intenta nuevamente.'
			if (err?.response?.data) message = err.response.data.error ?? JSON.stringify(err.response.data)
			Swal.fire({ title: 'Error', text: message, icon: 'error', confirmButtonColor: '#0470BB' })
		}
	}

	const handleToggleStatus = async (cat) => {
		const isDeactivating = cat.IsActive
		const result = await Swal.fire({
			title: isDeactivating ? '¿Desactivar categoría?' : '¿Activar categoría?',
			text: `¿Estás seguro de ${isDeactivating ? 'desactivar' : 'activar'} "${cat.NombreCat || cat.NombreCategoria}"?`,
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
			const id = cat.idCatEmpleado ?? cat.id
			await cambiarEstadoCategoria(id, nuevoEstado)
			obtenerCategorias()
			Swal.fire({ title: isDeactivating ? 'Desactivada' : 'Activada', text: `La categoría fue ${isDeactivating ? 'desactivada' : 'activada'}.`, icon: 'success', confirmButtonColor: '#0470BB', timer: 1400, timerProgressBar: true })
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
						<h2 className="servicios-title">
							<span className="material-symbols-outlined me-2">groups</span>
							Categorías de Empleados
						</h2>
						<p className="servicios-subtitle">Gestiona las categorías (roles) del personal</p>
					</div>
					<button className="btn btn-fissio-primary" onClick={handleCreate}>
						<span className="material-symbols-outlined me-1">add</span>
						Nueva Categoría
					</button>
				</div>

				<div className="row mb-4">
					<div className="col-md-4">
						<div className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')} title="Ver todos">
							<div className="card-body">
								<h5 className="stats-value">{(categorias || []).length}</h5>
								<p className="stats-title">Total Categorías</p>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`} onClick={() => setFiltro('activos')} title="Ver activos">
							<div className="card-body">
								<h5 className="stats-value text-success">{(categorias || []).filter(c => c.IsActive).length}</h5>
								<p className="stats-title">Activos</p>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`} onClick={() => setFiltro('inactivos')} title="Ver inactivos">
							<div className="card-body">
								<h5 className="stats-value text-danger">{(categorias || []).filter(c => !c.IsActive).length}</h5>
								<p className="stats-title">Inactivos</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="servicios-filters">
				<div className="row mb-3">
					<div className="col-md-6">
						<div className="input-group">
							<span className="input-group-text"><span className="material-symbols-outlined">search</span></span>
							<input type="text" className="form-control" placeholder="Buscar categorías..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
						</div>
					</div>
					<div className="col-md-3">
						<select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
							<option value="todos">🔍 Todas</option>
							<option value="activos">✅ Solo activos</option>
							<option value="inactivos">❌ Solo inactivos</option>
						</select>
					</div>
				</div>
			</div>

			<div className="servicios-table">
				<div className="card">
					<div className="card-body">
						{loading ? (
							<div className="text-center py-4">
								<div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
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
										{categoriasFiltradas.length > 0 ? (
											categoriasFiltradas.map(cat => (
												<tr key={cat.idCatEmpleado ?? cat.id}>
													<td className="fw-medium">{cat.NombreCat || cat.NombreCategoria}</td>
													<td>{cat.DescripcionCat || cat.DescripcionCategoria}</td>
													<td>
														<span className={`badge ${cat.IsActive ? 'bg-success' : 'bg-danger'}`}>{cat.IsActive ? 'Activo' : 'Inactivo'}</span>
													</td>
													<td>
														<div className="d-flex gap-1">
															<button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(cat)} title="Editar categoría"><span className="material-symbols-outlined">edit</span></button>
															<button className={`btn btn-sm ${cat.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => handleToggleStatus(cat)} title={cat.IsActive ? 'Desactivar' : 'Activar'}>
																{cat.IsActive ? <span className="material-symbols-outlined">block</span> : <span className="material-symbols-outlined">check_circle</span>}
															</button>
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan="4" className="text-center py-4">
													<span className="material-symbols-outlined fs-1 text-muted">groups</span>
													<p className="text-muted mt-2">No hay categorías que coincidan con los filtros</p>
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

			{showModal && (
				<div className="modal fade show d-block modal-backdrop-custom">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title"><span className="material-symbols-outlined me-2">groups</span>{modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}</h5>
								<button type="button" className="btn-close" onClick={handleCloseModal}></button>
							</div>
							<form onSubmit={handleSave}>
								<div className="modal-body">
									<div className="row">
										<div className="col-12 mb-3">
											<label htmlFor="NombreCategoria" className="form-label">Nombre *</label>
											<input id="NombreCategoria" name="NombreCategoria" className={`form-control ${formData.NombreCategoria && nombreYaExiste(formData.NombreCategoria) ? 'is-invalid' : ''}`} value={formData.NombreCategoria} onChange={handleInputChange} required placeholder="Ej: Fisioterapeuta" />
											{formData.NombreCategoria && nombreYaExiste(formData.NombreCategoria) && <div className="invalid-feedback">Este nombre ya está en uso.</div>}
										</div>
										<div className="col-12 mb-3">
											<label htmlFor="DescripcionCategoria" className="form-label">Descripción</label>
											<textarea id="DescripcionCategoria" name="DescripcionCategoria" className="form-control" rows="4" value={formData.DescripcionCategoria} onChange={handleInputChange} placeholder="Descripción de la categoría (opcional)"></textarea>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
									<button type="submit" className="btn btn-fissio-primary" disabled={!formData.NombreCategoria.trim() || nombreYaExiste(formData.NombreCategoria)}>
										<span className="material-symbols-outlined me-1">save</span>{modalMode === 'create' ? 'Crear Categoría' : 'Guardar cambios'}
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

export default Categorias

