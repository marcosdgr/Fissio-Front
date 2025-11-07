import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import useCustomPlanesObra from '../../../Custom/ObrasSociales/useCustomPlanesObra.js'
import '../../../Css/ObrasSociales/PlanesObra.css'

import PlanesObraTable from './ComponentesPlanes/PlanesObraTable'
import FiltrosPlanesObra from './ComponentesPlanes/FiltrosPlanesObra'
import ModalPlanObra from './ComponentesPlanes/ModalPlanObra'
import VerPlanObraModal from './ComponentesPlanes/VerPlanObraModal'

const emptyForm = {
  NombraPlan: '',
  DescripcionPlan: '',
  idObraSocial: '',
}

const safeGetDescripcion = (o) => o?.DescripcionPlan ?? o?.['DescripciónPlan'] ?? ''

const CrudPlanesObra = () => {
  const {
    planes = [],
    loading = false,
    error = null,
    obtenerTodosLosPlanes,
    crearPlanObra,
    actualizarPlanObra,
    obtenerPlanesActivos,
    obetenerPlanesInactivos,
  } = useCustomPlanesObra()

  const [formPlan, setFormPlan] = useState(emptyForm)
  const [idPlanEditar, setIdPlanEditar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('info')
  const [openModalNuevo, setOpenModalNuevo] = useState(false)
  const [openModalVer, setOpenModalVer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todas')

  useEffect(() => {
    obtenerTodosLosPlanes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mostrarMensaje = (msg, tipo = 'info') => {
    setMensaje(msg)
    setTipoMensaje(tipo)
    setTimeout(() => setMensaje(''), 3000)
  }

  const handleChange = (e) => setFormPlan({ ...formPlan, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formPlan.NombraPlan.trim()) {
      mostrarMensaje('El nombre del plan es obligatorio.', 'danger')
      return
    }

    const confirm = await Swal.fire({
      title: idPlanEditar ? '¿Guardar cambios?' : '¿Crear nuevo plan de obra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    })

    if (!confirm.isConfirmed) {
      mostrarMensaje('Operación cancelada.', 'info')
      return
    }

    try {
      if (idPlanEditar) {
        const res = await actualizarPlanObra(idPlanEditar, formPlan)
        if (res?.success || res?.idPlanObra) mostrarMensaje('Plan actualizado.', 'success')
        else mostrarMensaje(res?.error || 'Error al actualizar.', 'danger')
      } else {
        const res = await crearPlanObra(formPlan)
        if (res?.success) mostrarMensaje('Plan creado.', 'success')
        else mostrarMensaje(res?.error || 'Error al crear.', 'danger')
      }

      await obtenerTodosLosPlanes()
      setFormPlan(emptyForm)
      setIdPlanEditar(null)
      setOpenModalNuevo(false)
    } catch (err) {
      const mensajeError = err?.response?.data?.message || err?.message || 'Ocurrió un error.'
      mostrarMensaje(mensajeError, 'danger')
      setOpenModalNuevo(false)
    }
  }

  const handleSearchChange = (e) => setSearchQuery(e.target.value)
  const handleSearchSubmit = (e) => e.preventDefault()

  const handleFilterTodas = async () => {
    setActiveFilter('todas')
    await obtenerTodosLosPlanes()
  }
  const handleFilterActivas = async () => {
    setActiveFilter('activa')
    if (typeof obtenerPlanesActivos === 'function') await obtenerPlanesActivos()
  }
  const handleFilterInactivas = async () => {
    setActiveFilter('inactiva')
    if (typeof obetenerPlanesInactivos === 'function') await obetenerPlanesInactivos()
  }

  const handleEditarPlan = (plan) => {
    setFormPlan({
      NombraPlan: plan.NombraPlan || plan.NombrePlan || '',
      DescripcionPlan: safeGetDescripcion(plan) || '',
      idObraSocial: plan.idObraSocial || '',
    })
    setIdPlanEditar(plan.idPlanObra)
    setOpenModalNuevo(true)
  }

  const handleNuevoPlan = () => {
    setFormPlan(emptyForm)
    setIdPlanEditar(null)
    setOpenModalNuevo(true)
  }

  const handleVerPlan = (plan) => {
    setFormPlan({
      idPlanObra: plan.idPlanObra,
      NombraPlan: plan.NombraPlan || plan.NombrePlan || '',
      DescripcionPlan: safeGetDescripcion(plan) || '',
      NombreObraSocial: plan.NombreObraSocial || plan.NombreObra || '',
      idObraSocial: plan.idObraSocial || '',
      IsActive: plan.IsActive,
    })
    setOpenModalVer(true)
  }

  const closeModalNuevo = () => setOpenModalNuevo(false)
  const closeModalVer = () => setOpenModalVer(false)

  return (
    <>
      {mensaje && (
        <div className={`alert alert-${tipoMensaje} alert-dismissible fade show`} role="alert">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">Error: {String(error)}</div>
      )}

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Planes de Obra</h5>
          <button type="button" className="btn po-create-main btn-lg" onClick={handleNuevoPlan}>Agregar nuevo Plan</button>
        </div>

        <div className="card-body">
          <FiltrosPlanesObra
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            activeFilter={activeFilter}
            onTodas={handleFilterTodas}
            onActivas={handleFilterActivas}
            onInactivas={handleFilterInactivas}
          />

          {/* Tabla de Planes de Obra */}
          <PlanesObraTable
            planes={planes}
            loading={loading}
            searchQuery={searchQuery}
            onEdit={handleEditarPlan}
            onView={handleVerPlan}
          />
        </div>
      </div>

      <ModalPlanObra open={openModalNuevo} onClose={closeModalNuevo} onSubmit={handleSubmit} formPlan={formPlan} onChange={handleChange} idPlanEditar={idPlanEditar} />
      <VerPlanObraModal open={openModalVer} onClose={closeModalVer} plan={formPlan} />
    </>
  )
}

export default CrudPlanesObra
