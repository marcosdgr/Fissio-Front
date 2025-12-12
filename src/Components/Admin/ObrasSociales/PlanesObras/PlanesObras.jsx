import { useEffect, useMemo, useState } from 'react'
import useCustomPlanesObra from '../../../../Custom/ObrasSociales/useCustomPlanesObra'
import useCustomObrasSociales from '../../../../Custom/ObrasSociales/useCustomObrasSociales'
import { showConfirm, showSuccess, showError } from '../../../../Utils/sweetAlerts'
import '../../../../Css/Admin/ObrasSociales/planesobras.css'
import PlanesFilters from './PlanesFilters'
import PlanesTable from './PlanesTable'
import PlanCreateModal from './PlanCreateModal'
import PlanEditModal from './PlanEditModal'
import PlanViewModal from './PlanViewModal'

const PlanesObras = ({ obrasSocialesProp }) => {
  const { planes = [], obtenerTodosLosPlanes, crearPlanObra, actualizarPlanObra, cambiarEstadoPlanObra } = useCustomPlanesObra()
  const { obrasSociales: obrasSocialesLocal = [], obtenerTodasLasObrasSociales } = useCustomObrasSociales()

  const obrasSociales = obrasSocialesProp || obrasSocialesLocal

  const [obraFilter, setObraFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ NombraPlan: '', DescripcionPlan: '', PorcentajeDescuentoPlan: '', idObraSocial: '', EstadoPlan: 'Vigente', IsActive: 1 })
  const [errors, setErrors] = useState({})
  const [loadingOp, setLoadingOp] = useState(false)

  useEffect(() => { 
    if (!obrasSocialesProp && obtenerTodasLasObrasSociales) {
      obtenerTodasLasObrasSociales();
    }
    obtenerTodosLosPlanes && obtenerTodosLosPlanes();
  }, [])

  useEffect(() => {}, [planes, obrasSociales])

  const visible = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    let list = planes || []
    if (obraFilter) {
      const f = String(obraFilter)
      const obraObjFilter = obrasSociales.find(o => String(o.idObraSocial ?? o.id) === f)
      const obraNameFilter = obraObjFilter ? String(obraObjFilter.NombreObraSocial ?? obraObjFilter.Nombre ?? obraObjFilter.nombre ?? '').trim().toLowerCase() : null

      list = list.filter(p => {
        const pid = p.idObraSocial ?? p.id_obraSocial ?? p.idObra
        if (pid !== undefined && pid !== null && pid !== '') {
          return String(pid) === f
        }
        if (obraNameFilter && (p.NombreObraSocial ?? p.Nombre ?? p.nombre)) {
          return String(p.NombreObraSocial ?? p.Nombre ?? p.nombre).trim().toLowerCase() === obraNameFilter
        }
        return false
      })
    }
    if (estadoFilter) {
      const ef = String(estadoFilter).trim().toLowerCase()
      list = list.filter(p => {
        const estado = String(p.EstadoPlan ?? (p.IsActive !== undefined ? (p.IsActive ? 'Vigente' : 'No vigente') : 'Vigente')).trim().toLowerCase()
        return estado === ef
      })
    }
    if (!q) return list
    return list.filter(p => (p.NombraPlan ?? p.nombre ?? '').toString().toLowerCase().includes(q) || (p.DescripcionPlan ?? '').toString().toLowerCase().includes(q))
  }, [planes, obraFilter, query, obrasSociales, estadoFilter])

  const resetForm = () => { setForm({ NombraPlan: '', DescripcionPlan: '', PorcentajeDescuentoPlan: '', idObraSocial: '', EstadoPlan: 'Vigente', IsActive: 1 }); setErrors({}) }
  const handleChange = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); if (errors && errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next }) }

  const validate = (values, isEdit = false) => {
    const errs = {}
    const nombre = (values.NombraPlan || '').toString().trim()
    const porcentaje = (values.PorcentajeDescuentoPlan || '').toString().trim()
    const idObra = values.idObraSocial || ''
    const estado = values.EstadoPlan ?? ''
    if (!nombre) errs.NombraPlan = 'El nombre del plan es obligatorio'
    if (!porcentaje) errs.PorcentajeDescuentoPlan = 'El porcentaje es obligatorio'
    else {
      const num = parseFloat(porcentaje)
      if (Number.isNaN(num) || num < 0 || num > 100) errs.PorcentajeDescuentoPlan = 'El porcentaje debe ser un número entre 0 y 100'
    }
    if (!idObra) errs.idObraSocial = 'Debe seleccionar una obra social'
    if (!estado) errs.EstadoPlan = 'Debe seleccionar el estado del plan'
    const list = planes || []
    if (nombre && idObra) {
      const exists = list.some(p => {
        const pidObra = p.idObraSocial ?? p.id_obraSocial ?? p.idObra
        if (isEdit && selected) {
          const idPlan = p.idPlanObra ?? p.idPlan ?? p.id
          const sid = selected.idPlanObra ?? selected.idPlan ?? selected.id
          if (idPlan === sid) return false
        }
        return (pidObra == idObra) && (p.NombraPlan ?? p.nombre ?? '').toString().trim().toLowerCase() === nombre.toLowerCase()
      })
      if (exists) errs.NombraPlan = 'Ya existe un plan con ese nombre para la obra seleccionada'
    }

    return errs
  }
  const onCreate = async () => {
    const v = validate(form, false)
    if (Object.keys(v).length > 0) {
      setErrors(v)
      if (v.NombraPlan && String(v.NombraPlan).toLowerCase().includes('ya existe')) return showError('Nombre duplicado', v.NombraPlan)
      return showError('Validación', 'Corrige los campos en rojo')
    }
    const confirmed = await showConfirm('Crear plan', '¿Deseas crear este plan?', 'Crear', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const payload = { ...form, PorcentajeDescuentoPlan: parseFloat(form.PorcentajeDescuentoPlan), EstadoPlan: form.EstadoPlan ?? 'Vigente', IsActive: form.IsActive ?? 1 }
      const res = await crearPlanObra(payload)
      if (res?.success === false) showError('Error', res.error || 'No se pudo crear el plan')
      else { showSuccess('Creado', 'Plan creado correctamente'); resetForm(); setIsCreateOpen(false); obtenerTodosLosPlanes && obtenerTodosLosPlanes() }
    } catch (err) { showError('Error', err?.message || 'Error inesperado') }
    finally { setLoadingOp(false) }
  }

  const onEdit = async () => {
    const v = validate(form, true)
    if (Object.keys(v).length > 0) {
      setErrors(v)
      if (v.NombraPlan && String(v.NombraPlan).toLowerCase().includes('ya existe')) return showError('Nombre duplicado', v.NombraPlan)
      return showError('Validación', 'Corrige los campos en rojo')
    }
    const confirmed = await showConfirm('Guardar cambios', '¿Deseas guardar los cambios realizados?', 'Guardar', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const id = selected?.idPlanObra ?? selected?.idPlan ?? selected?.id
      const res = await actualizarPlanObra(id, { ...form, PorcentajeDescuentoPlan: parseFloat(form.PorcentajeDescuentoPlan), EstadoPlan: form.EstadoPlan, IsActive: form.IsActive })
      if (res?.success === false) showError('Error', res.error || 'No se pudo actualizar')
      else { showSuccess('Guardado', 'Plan actualizado correctamente'); setIsEditOpen(false); obtenerTodosLosPlanes && obtenerTodosLosPlanes() }
    } catch (err) { showError('Error', err?.message || 'Error inesperado') }
    finally { setLoadingOp(false) }
  }

  const onToggle = async (plan) => {
    const currentEstado = plan.EstadoPlan ?? (plan.IsActive !== undefined ? (plan.IsActive ? 'Vigente' : 'No vigente') : 'Vigente')
    const nextEstado = currentEstado === 'Vigente' ? 'No vigente' : 'Vigente'
    const action = currentEstado === 'Vigente' ? 'pasar a No vigente' : 'pasar a Vigente'
    const confirmed = await showConfirm(`¿Deseas ${action} el plan?`, plan.NombraPlan ?? plan.nombre ?? '', 'Sí', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const id = plan.idPlanObra ?? plan.idPlan ?? plan.id
      await cambiarEstadoPlanObra(id)
      showSuccess('Listo', `Plan actualizado a ${nextEstado}`)
      obtenerTodosLosPlanes && obtenerTodosLosPlanes()
    } catch (err) { showError('Error', err?.message || 'Error inesperado') }
    finally { setLoadingOp(false) }
  }

  const openEdit = (plan) => {
    setSelected(plan)
    setForm({
      NombraPlan: plan.NombraPlan ?? plan.nombre ?? '',
      DescripcionPlan: plan.DescripcionPlan ?? '',
      PorcentajeDescuentoPlan: plan.PorcentajeDescuentoPlan ?? plan.Porcentaje ?? '',
      idObraSocial: plan.idObraSocial ?? plan.id_obraSocial ?? '',
      EstadoPlan: plan.EstadoPlan ?? 'Vigente',
      IsActive: plan.IsActive !== undefined ? Number(plan.IsActive) : 1
    })
    setErrors({})
    setIsEditOpen(true)
  }
  const openView = (plan) => { setSelected(plan); setIsViewOpen(true) }

  return (
    <div className="planes-container">
      <PlanesFilters
        obraFilter={obraFilter}
        setObraFilter={setObraFilter}
        obrasSociales={obrasSociales}
        query={query}
        setQuery={setQuery}
        estadoFilter={estadoFilter}
        setEstadoFilter={setEstadoFilter}
        onAdd={() => { resetForm(); setIsCreateOpen(true) }}
      />
      <PlanesTable visible={visible} obrasSociales={obrasSociales} openView={openView} openEdit={openEdit} onToggle={onToggle} />

      <PlanCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} form={form} handleChange={handleChange} errors={errors} onCreate={onCreate} loadingOp={loadingOp} obrasSociales={obrasSociales} />

      <PlanEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} form={form} handleChange={handleChange} errors={errors} onEdit={onEdit} loadingOp={loadingOp} obrasSociales={obrasSociales} />

      <PlanViewModal isOpen={isViewOpen} selected={selected} onClose={() => setIsViewOpen(false)} obrasSociales={obrasSociales} />

    </div>
  )
}

export default PlanesObras
