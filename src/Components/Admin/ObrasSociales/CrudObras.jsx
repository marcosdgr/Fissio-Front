import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales'
import '../../../Css/ObrasSociales/ObrasSociales.css'

import ObrasSocialesTable from './ComponentesObrasSociales/ObrasSocialesTable'
import FiltrosObrasSociales from './ComponentesObrasSociales/FiltrosObrasSociales'
import ModalObraSocial from './ComponentesObrasSociales/ModalObraSocial'
import VerObraSocialModal from './ComponentesObrasSociales/VerObraSocialModal'

const emptyForm = {
  NombreObraSocial: '',
  TelefonoObra: '',
  EmailObra: '',
  PaginaWebObra: '',
  EstadoObra: 'Activa',
}

const CrudObrasSociales = () => {
  const {
    obrasSociales = [],
    loading = false,
    error = null,
    obtenerTodasLasObrasSociales,
    crearObraSocial,
    actualizarObraSocial,
    obtenerObrasSocialesActivas,
    obtenerObrasSocialesInactivas,
  } = useCustomObrasSociales()

  const [formObra, setFormObra] = useState(emptyForm)
  const [idObraEditar, setIdObraEditar] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('info')
  const [openModalNuevo, setOpenModalNuevo] = useState(false)
  const [openModalVer, setOpenModalVer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todas')

  useEffect(() => {
    obtenerTodasLasObrasSociales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mostrarMensaje = (msg, tipo = 'info') => {
    setMensaje(msg)
    setTipoMensaje(tipo)
    setTimeout(() => setMensaje(''), 3000)
  }

  const handleChange = (e) => setFormObra({ ...formObra, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formObra.NombreObraSocial.trim() || !formObra.TelefonoObra.trim() || !formObra.EmailObra.trim()) {
      mostrarMensaje('Nombre, teléfono y email son obligatorios.', 'danger')
      return
    }

    const confirm = await Swal.fire({
      title: idObraEditar ? '¿Guardar cambios?' : '¿Crear nueva obra social?',
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
      if (idObraEditar) {
        const res = await actualizarObraSocial(idObraEditar, formObra)
        if (res?.success) mostrarMensaje('Obra social actualizada.', 'success')
        else mostrarMensaje(res?.error || 'Error al actualizar.', 'danger')
      } else {
        const res = await crearObraSocial(formObra)
        if (res?.success) mostrarMensaje('Obra social creada.', 'success')
        else mostrarMensaje(res?.error || 'Error al crear.', 'danger')
      }

      await obtenerTodasLasObrasSociales()
      setFormObra(emptyForm)
      setIdObraEditar(null)
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
    await obtenerTodasLasObrasSociales()
  }
  const handleFilterActivas = async () => {
    setActiveFilter('activa')
    if (typeof obtenerObrasSocialesActivas === 'function') await obtenerObrasSocialesActivas()
  }
  const handleFilterInactivas = async () => {
    setActiveFilter('inactiva')
    if (typeof obtenerObrasSocialesInactivas === 'function') await obtenerObrasSocialesInactivas()
  }

  const handleEditarObra = (obra) => {
    setFormObra({
      NombreObraSocial: obra.NombreObraSocial || '',
      TelefonoObra: obra.TelefonoObra || '',
      EmailObra: obra.EmailObra || '',
      PaginaWebObra: obra.PaginaWebObra || '',
      EstadoObra: obra.EstadoObra || 'Activa',
    })
    setIdObraEditar(obra.idObraSocial)
    setOpenModalNuevo(true)
  }

  const handleNuevoObra = () => {
    setFormObra(emptyForm)
    setIdObraEditar(null)
    setOpenModalNuevo(true)
  }

  const handleVerObra = (obra) => {
    setFormObra({
      NombreObraSocial: obra.NombreObraSocial || '',
      TelefonoObra: obra.TelefonoObra || '',
      EmailObra: obra.EmailObra || '',
      PaginaWebObra: obra.PaginaWebObra || '',
      EstadoObra: obra.EstadoObra || 'Activa',
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
          <h5 className="card-title mb-0">Obras Sociales</h5>
          <button type="button" className="btn os-create-main btn-lg" onClick={handleNuevoObra}>Agregar nueva Obra Social</button>
        </div>

        <div className="card-body">
          <FiltrosObrasSociales
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            activeFilter={activeFilter}
            onTodas={handleFilterTodas}
            onActivas={handleFilterActivas}
            onInactivas={handleFilterInactivas}
          />

          <ObrasSocialesTable
            obrasSociales={obrasSociales}
            loading={loading}
            searchQuery={searchQuery}
            onEdit={handleEditarObra}
            onView={handleVerObra}
          />
        </div>
      </div>

      <ModalObraSocial open={openModalNuevo} onClose={closeModalNuevo} onSubmit={handleSubmit} formObra={formObra} onChange={handleChange} idObraEditar={idObraEditar} />
      <VerObraSocialModal open={openModalVer} onClose={closeModalVer} obra={formObra} />
    </>
  )
}

export default CrudObrasSociales
