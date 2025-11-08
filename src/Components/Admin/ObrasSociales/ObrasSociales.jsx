import React, { useEffect, useMemo, useState } from 'react'
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales'
import { showConfirm, showSuccess, showError } from '../../../Utils/sweetAlerts'
import '../../../Css/Admin/ObrasSociales/ObrasSociales.css'

import FilterCards from './FilterCards'
import SearchBar from './SearchBar'
import ObrasTable from './ObrasTable'
import MobileCards from './MobileCards'
import ModalCrearObra from './ModalCrearObra'
import ModalEditarObra from './ModalEditarObra'
import ModalVerObra from './ModalVerObra'
import PlanesObras from './PlanesObras/PlanesObras'

const ObrasSociales = () => {
  const { obrasSociales = [], obtenerTodasLasObrasSociales, crearObraSocial, actualizarObraSocial, borradoLogicoObraSocial } = useCustomObrasSociales()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todas')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ NombreObraSocial: '', TelefonoObra: '', EmailObra: '', PaginaWebObra: '', EstadoObra: 'Activa' })
  const [errors, setErrors] = useState({})
  const [loadingOp, setLoadingOp] = useState(false)

  useEffect(() => {
    obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const counts = useMemo(() => {
    let total = 0, act = 0, inac = 0
    const list = obrasSociales || []
    list.forEach(o => {
      total += 1
      if (o.IsActive === 0 || o.IsActive === false) inac += 1
      else act += 1
    })
    return { total, act, inac }
  }, [obrasSociales])

  const visible = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    const list = obrasSociales || []
    const base = list.filter(o => {
      if (filter && filter !== 'Todas') {
        if (filter === 'Activas') return o.IsActive === 1 || o.IsActive === true || o.IsActive === '1'
        if (filter === 'Inactivas') return o.IsActive === 0 || o.IsActive === false || o.IsActive === '0'
      }
      return true
    })
    if (!q) return base
    return base.filter(o => {
      const nombre = (o.NombreObraSocial ?? o.Nombre ?? o.nombre ?? '').toString().toLowerCase()
      const telefono = (o.TelefonoObra ?? o.telefono ?? '').toString().toLowerCase()
      const email = (o.EmailObra ?? o.email ?? '').toString().toLowerCase()
      return nombre.includes(q) || telefono.includes(q) || email.includes(q)
    })
  }, [obrasSociales, query, filter])

  const resetForm = () => {
    setForm({ NombreObraSocial: '', TelefonoObra: '', EmailObra: '', PaginaWebObra: '', EstadoObra: 'Activa' })
    setErrors({})
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors && errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (values, isEdit = false) => {
    // Reglas solicitadas por el backend y mensajes en español
    const errs = {}
    const NombreObraSocial = (values.NombreObraSocial || '').toString().trim()
    const TelefonoObra = (values.TelefonoObra || '').toString().trim()
    const EmailObra = (values.EmailObra || '').toString().trim()
    const PaginaWebObra = (values.PaginaWebObra || '').toString().trim()

    // 1. Obligatorios
    if (!NombreObraSocial || !TelefonoObra || !EmailObra) {
      if (!NombreObraSocial) errs.NombreObraSocial = 'El nombre es obligatorio'
      if (!TelefonoObra) errs.TelefonoObra = 'El teléfono es obligatorio'
      if (!EmailObra) errs.EmailObra = 'El email es obligatorio'
      // continue to collect more errors
    }

    // 2. Formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (EmailObra && !emailRegex.test(EmailObra)) errs.EmailObra = 'El formato del email no es válido'

    // 3. Formato URL si se proporciona (regex provisto)
    if (PaginaWebObra) {
      // Regex adaptado para evitar escapes problemáticos en las clases del linter
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/?[\w .-]*)?$/
      if (!urlRegex.test(PaginaWebObra)) errs.PaginaWebObra = 'El formato de la página web no es válido'
    }

    // 4. Unicidad local (no permitir repetir ningún dato: nombre, teléfono, email, página web)
    const list = obrasSociales || []
    // helper to compare ignoring case/trim
    const eq = (a, b) => (a || '').toString().trim().toLowerCase() === (b || '').toString().trim().toLowerCase()

    if (NombreObraSocial) {
      const exists = list.some(o => {
        const nombre = o.NombreObraSocial ?? o.Nombre ?? o.nombre
        if (!nombre) return false
        if (isEdit && selected) {
          const id = o.idObraSocial ?? o.id ?? o.id_obrasocial
          const sid = selected.idObraSocial ?? selected.id ?? selected.id_obrasocial
          if (id === sid) return false
        }
        return eq(nombre, NombreObraSocial)
      })
      if (exists) errs.NombreObraSocial = isEdit ? 'Ya existe otra obra social con ese nombre' : 'Ya existe una obra social con ese nombre'
    }

    if (TelefonoObra) {
      const exists = list.some(o => {
        const tel = o.TelefonoObra ?? o.Telefono ?? o.telefono
        if (!tel) return false
        if (isEdit && selected) {
          const id = o.idObraSocial ?? o.id ?? o.id_obrasocial
          const sid = selected.idObraSocial ?? selected.id ?? selected.id_obrasocial
          if (id === sid) return false
        }
        return tel.toString().trim() === TelefonoObra
      })
      if (exists) errs.TelefonoObra = isEdit ? 'Ya existe otra obra social con ese teléfono' : 'Ya existe una obra social con ese teléfono'
    }

    if (EmailObra) {
      const exists = list.some(o => {
        const em = o.EmailObra ?? o.Email ?? o.email
        if (!em) return false
        if (isEdit && selected) {
          const id = o.idObraSocial ?? o.id ?? o.id_obrasocial
          const sid = selected.idObraSocial ?? selected.id ?? selected.id_obrasocial
          if (id === sid) return false
        }
        return eq(em, EmailObra)
      })
      if (exists) errs.EmailObra = isEdit ? 'Ya existe otra obra social con ese email' : 'Ya existe una obra social con ese email'
    }

    if (PaginaWebObra) {
      const exists = list.some(o => {
        const web = o.PaginaWebObra ?? o.PaginaWeb ?? o.pagina
        if (!web) return false
        if (isEdit && selected) {
          const id = o.idObraSocial ?? o.id ?? o.id_obrasocial
          const sid = selected.idObraSocial ?? selected.id ?? selected.id_obrasocial
          if (id === sid) return false
        }
        return eq(web, PaginaWebObra)
      })
      if (exists) errs.PaginaWebObra = isEdit ? 'Ya existe otra obra social con esa página web' : 'Ya existe una obra social con esa página web'
    }

    return errs
  }

  const onCreate = async () => {
    const v = validate(form, false)
    if (Object.keys(v).length > 0) { setErrors(v); return showError('Validación', 'Corrige los campos en rojo') }
    const confirmed = await showConfirm('Crear obra social', '¿Deseas crear esta obra social?', 'Crear', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const payload = { ...form }
      const res = await crearObraSocial(payload)
      if (res?.success === false) {
        const errMsg = (res.error || '').toString()
        const lower = errMsg.toLowerCase()
        // Map backend messages to field errors cuando sea posible
        if (lower.includes('tel') || lower.includes('teléfono')) {
          setErrors({ TelefonoObra: errMsg })
        } else if (lower.includes('email')) {
          setErrors({ EmailObra: errMsg })
        } else if (lower.includes('pág') || lower.includes('pagina') || lower.includes('página')) {
          setErrors({ PaginaWebObra: errMsg })
        } else if (lower.includes('nombre')) {
          setErrors({ NombreObraSocial: errMsg })
        } else {
          showError('Error', errMsg || 'No se pudo crear la obra social')
        }
      } else {
        showSuccess('Creado', 'Obra social creada correctamente')
        resetForm()
        setIsCreateOpen(false)
        obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales()
      }
    } catch (err) {
      // err puede venir del hook con err.response?.data
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || err.toString()
      const lower = (serverMsg || '').toString().toLowerCase()
      if (lower.includes('tel') || lower.includes('teléfono')) setErrors({ TelefonoObra: serverMsg })
      else if (lower.includes('email')) setErrors({ EmailObra: serverMsg })
      else if (lower.includes('pág') || lower.includes('pagina') || lower.includes('página')) setErrors({ PaginaWebObra: serverMsg })
      else if (lower.includes('nombre')) setErrors({ NombreObraSocial: serverMsg })
      else showError('Error', serverMsg || 'Error inesperado')
    } finally { setLoadingOp(false) }
  }

  const onEdit = async () => {
    const v = validate(form, true)
    if (Object.keys(v).length > 0) { setErrors(v); return showError('Validación', 'Corrige los campos en rojo') }
    const confirmed = await showConfirm('Guardar cambios', '¿Deseas guardar los cambios realizados?', 'Guardar', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const id = selected?.idObraSocial ?? selected?.id ?? selected?.id_obrasocial
      const res = await actualizarObraSocial(id, form)
      if (res?.success === false) {
        const errMsg = (res.error || '').toString()
        const lower = errMsg.toLowerCase()
        if (lower.includes('tel') || lower.includes('teléfono')) setErrors({ TelefonoObra: errMsg })
        else if (lower.includes('email')) setErrors({ EmailObra: errMsg })
        else if (lower.includes('pág') || lower.includes('pagina') || lower.includes('página')) setErrors({ PaginaWebObra: errMsg })
        else if (lower.includes('nombre')) setErrors({ NombreObraSocial: errMsg })
        else showError('Error', errMsg || 'No se pudo actualizar')
      } else {
        showSuccess('Guardado', 'Obra social actualizada correctamente')
        setIsEditOpen(false)
        obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales()
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || err.toString()
      const lower = (serverMsg || '').toString().toLowerCase()
      if (lower.includes('tel') || lower.includes('teléfono')) setErrors({ TelefonoObra: serverMsg })
      else if (lower.includes('email')) setErrors({ EmailObra: serverMsg })
      else if (lower.includes('pág') || lower.includes('pagina') || lower.includes('página')) setErrors({ PaginaWebObra: serverMsg })
      else if (lower.includes('nombre')) setErrors({ NombreObraSocial: serverMsg })
      else showError('Error', serverMsg || 'Error inesperado')
    } finally { setLoadingOp(false) }
  }

  const onToggle = async (obra) => {
    const isActive = obra.IsActive !== undefined ? Boolean(obra.IsActive) : true
    const action = isActive ? 'desactivar' : 'activar'
    const confirmed = await showConfirm(`¿Deseas ${action} la obra social?`, obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '', 'Sí', 'Cancelar')
    if (!confirmed || !confirmed.isConfirmed) return
    setLoadingOp(true)
    try {
      const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial
      const res = await borradoLogicoObraSocial(id)
      if (res?.success === false) showError('Error', res.error || 'No se pudo cambiar el estado')
      else {
        showSuccess('Listo', `Obra ${action}da correctamente`)
        obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales()
      }
    } catch (err) { showError('Error', err.message || 'Error inesperado') }
    finally { setLoadingOp(false) }
  }

  const openEdit = (obra) => {
    setSelected(obra)
    setForm({
      NombreObraSocial: obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '',
      TelefonoObra: obra.TelefonoObra ?? obra.telefono ?? '',
      EmailObra: obra.EmailObra ?? obra.email ?? '',
      PaginaWebObra: obra.PaginaWebObra ?? obra.pagina ?? obra.PaginaWeb ?? '',
      EstadoObra: obra.EstadoObra ?? obra.estado ?? (obra.IsActive ? 'Activa' : 'Suspendida')
    })
    setErrors({})
    setIsEditOpen(true)
  }

  const openView = (obra) => {
    setSelected(obra)
    setIsViewOpen(true)
  }

  return (
    <div className="servicios-container">
      <div className="servicios-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="servicios-title"><span className="material-symbols-outlined me-2">health_and_safety</span>Gestión de Obras Sociales</h2>
            <p className="servicios-subtitle">Administra las obras sociales y su estado</p>
          </div>
          <button className="btn btn-fissio-primary" onClick={() => { resetForm(); setIsCreateOpen(true) }}><span className="material-symbols-outlined me-1">add</span>Agregar Obra</button>
        </div>

        <div className="row mb-4">
          <FilterCards counts={counts} filter={filter} setFilter={setFilter} />
        </div>
      </div>

      <SearchBar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />

      <ObrasTable visible={visible} onView={openView} onEdit={openEdit} onToggle={onToggle} />

      {/* Planes asociados (se muestra debajo de la tabla de obras) */}
      <div className="mt-4">
        <PlanesObras />
      </div>

      <MobileCards visible={visible} onView={openView} onEdit={openEdit} onToggle={onToggle} />

      <ModalCrearObra open={isCreateOpen} onClose={() => setIsCreateOpen(false)} form={form} errors={errors} onChange={handleChange} onSubmit={onCreate} loading={loadingOp} />

      <ModalEditarObra open={isEditOpen} onClose={() => setIsEditOpen(false)} form={form} errors={errors} onChange={handleChange} onSubmit={onEdit} loading={loadingOp} />

      <ModalVerObra open={isViewOpen} onClose={() => setIsViewOpen(false)} obra={selected} />

    </div>
  )
}

export default ObrasSociales
