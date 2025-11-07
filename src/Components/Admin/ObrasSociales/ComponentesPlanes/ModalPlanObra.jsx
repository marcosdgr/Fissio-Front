import React from 'react'

// Ahora el modal recibe la lista de obras desde el padre para evitar llamar al hook aquí
const ModalPlanObra = ({ open, onClose, onSubmit, formPlan, onChange, idPlanEditar, obrasSociales = [] }) => {

  if (!open) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{idPlanEditar ? 'Editar Plan' : 'Nuevo Plan'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="NombraPlan" value={formPlan.NombraPlan || ''} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" name="DescripcionPlan" value={formPlan.DescripcionPlan || ''} onChange={onChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Obra social</label>
                <select className="form-select" name="idObraSocial" value={formPlan.idObraSocial || ''} onChange={onChange} required>
                  <option value="">-- Seleccione una obra social activa --</option>
                  {(obrasSociales || []).map((obra) => (
                    <option key={obra.idObraSocial} value={obra.idObraSocial}>{obra.NombreObraSocial}</option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{idPlanEditar ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalPlanObra
