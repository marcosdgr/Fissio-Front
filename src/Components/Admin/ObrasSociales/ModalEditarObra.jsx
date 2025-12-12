const ModalEditarObra = ({ open, onClose, form, errors = {}, onChange, onSubmit, loading }) => {
  if (!open) return null
  return (
    <div className="modal show d-block modal-obras-overlay">
      <div className="modal-dialog modal-lg modal-obras-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Obra Social</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input name="NombreObraSocial" className={`form-control ${errors.NombreObraSocial ? 'is-invalid' : ''}`} value={form.NombreObraSocial} onChange={e => onChange('NombreObraSocial', e.target.value)} />
                  {errors.NombreObraSocial && <div className="invalid-feedback">{errors.NombreObraSocial}</div>}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select className={`form-select ${errors.EstadoObra ? 'is-invalid' : ''}`} value={form.EstadoObra} onChange={e => onChange('EstadoObra', e.target.value)}>
                    <option value="Activa">Activa</option>
                    <option value="Suspendida">Suspendida</option>
                  </select>
                  {errors.EstadoObra && <div className="invalid-feedback">{errors.EstadoObra}</div>}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input name="TelefonoObra" className={`form-control ${errors.TelefonoObra ? 'is-invalid' : ''}`} value={form.TelefonoObra} onChange={e => onChange('TelefonoObra', e.target.value)} />
                  {errors.TelefonoObra && <div className="invalid-feedback">{errors.TelefonoObra}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="EmailObra" className={`form-control ${errors.EmailObra ? 'is-invalid' : ''}`} value={form.EmailObra} onChange={e => onChange('EmailObra', e.target.value)} />
                  {errors.EmailObra && <div className="invalid-feedback">{errors.EmailObra}</div>}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Página web</label>
              <input name="PaginaWebObra" className={`form-control ${errors.PaginaWebObra ? 'is-invalid' : ''}`} value={form.PaginaWebObra} onChange={e => onChange('PaginaWebObra', e.target.value)} />
              {errors.PaginaWebObra && <div className="invalid-feedback">{errors.PaginaWebObra}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalEditarObra
