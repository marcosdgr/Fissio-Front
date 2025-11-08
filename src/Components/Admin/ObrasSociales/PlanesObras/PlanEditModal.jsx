import React from 'react'

const PlanEditModal = ({ isOpen, onClose, form, handleChange, errors, onEdit, loadingOp, obrasSociales }) => {
  if (!isOpen) return null
  return (
    <div className="modal show d-block modal-obras-overlay">
      <div className="modal-dialog modal-lg modal-obras-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Plan</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input name="NombraPlan" className={`form-control ${errors.NombraPlan ? 'is-invalid' : ''}`} value={form.NombraPlan} onChange={e => handleChange('NombraPlan', e.target.value)} />
                  {errors.NombraPlan && <div className="invalid-feedback">{errors.NombraPlan}</div>}
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Obra social</label>
                  <select className={`form-select ${errors.idObraSocial ? 'is-invalid' : ''}`} value={form.idObraSocial} onChange={e => handleChange('idObraSocial', e.target.value)}>
                    <option value="">Seleccionar obra</option>
                    {obrasSociales.map(o => <option key={o.idObraSocial ?? o.id} value={o.idObraSocial ?? o.id}>{o.NombreObraSocial ?? o.Nombre ?? o.nombre}</option>)}
                  </select>
                  {errors.idObraSocial && <div className="invalid-feedback">{errors.idObraSocial}</div>}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">% Descuento</label>
                  <input type="number" step="0.01" min="0" max="100" name="PorcentajeDescuentoPlan" className={`form-control ${errors.PorcentajeDescuentoPlan ? 'is-invalid' : ''}`} value={form.PorcentajeDescuentoPlan} onChange={e => handleChange('PorcentajeDescuentoPlan', e.target.value)} />
                  {errors.PorcentajeDescuentoPlan && <div className="invalid-feedback">{errors.PorcentajeDescuentoPlan}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input name="DescripcionPlan" className={`form-control ${errors.DescripcionPlan ? 'is-invalid' : ''}`} value={form.DescripcionPlan} onChange={e => handleChange('DescripcionPlan', e.target.value)} />
                  {errors.DescripcionPlan && <div className="invalid-feedback">{errors.DescripcionPlan}</div>}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select name="EstadoPlan" className={`form-select ${errors.EstadoPlan ? 'is-invalid' : ''}`} value={form.EstadoPlan} onChange={e => handleChange('EstadoPlan', e.target.value)}>
                    <option value="Vigente">Vigente</option>
                    <option value="No vigente">No vigente</option>
                  </select>
                  {errors.EstadoPlan && <div className="invalid-feedback">{errors.EstadoPlan}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check mt-4">
                  <input className="form-check-input" type="checkbox" id="isActiveEdit" checked={Boolean(form.IsActive)} onChange={e => handleChange('IsActive', e.target.checked ? 1 : 0)} />
                  <label className="form-check-label ms-2" htmlFor="isActiveEdit">Activo</label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onEdit} disabled={loadingOp}>{loadingOp ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanEditModal
