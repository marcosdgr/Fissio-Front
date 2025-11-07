import React from 'react'

const ModalObraSocial = ({ open, onClose, onSubmit, formObra, onChange, idObraEditar }) => {
  if (!open) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{idObraEditar ? 'Editar Obra Social' : 'Nueva Obra Social'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="NombreObraSocial" value={formObra.NombreObraSocial} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="text" className="form-control" name="TelefonoObra" value={formObra.TelefonoObra} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="EmailObra" value={formObra.EmailObra} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Página web</label>
                <input type="text" className="form-control" name="PaginaWebObra" value={formObra.PaginaWebObra} onChange={onChange} />
              </div>

              {idObraEditar && (
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select className="form-select" name="EstadoObra" value={formObra.EstadoObra} onChange={onChange}>
                    <option value="Activa">Activa</option>
                    <option value="Suspendida">Suspendida</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">{idObraEditar ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalObraSocial
