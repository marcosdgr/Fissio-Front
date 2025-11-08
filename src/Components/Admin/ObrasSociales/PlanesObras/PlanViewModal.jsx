import React from 'react'

const PlanViewModal = ({ isOpen, selected, onClose, obrasSociales }) => {
  if (!isOpen || !selected) return null
  return (
    <div className="modal show d-block modal-obras-overlay">
      <div className="modal-dialog modal-ver-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-ver-header">
            <h5 className="modal-title">{selected.NombraPlan ?? selected.nombre}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="ver-field">
              <div className="ver-field-label">% Descuento</div>
              <div className="ver-field-value">{selected.PorcentajeDescuentoPlan ?? ''}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Descripción</div>
              <div className="ver-field-value">{selected.DescripcionPlan ?? ''}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Estado</div>
              <div className="ver-field-value"><span className={`badge ${((selected.EstadoPlan ?? 'Vigente') === 'Vigente') ? 'bg-success' : 'bg-warning text-dark'}`}>{selected.EstadoPlan ?? 'Vigente'}</span></div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Obra social</div>
              <div className="ver-field-value">{selected.NombreObraSocial ?? obrasSociales.find(o => String(o.idObraSocial ?? o.id) === String(selected.idObraSocial ?? selected.id_obraSocial ?? selected.idObra ?? ''))?.NombreObraSocial ?? ''}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Activo</div>
              <div className="ver-field-value">{selected.IsActive ? 'Sí' : 'No'}</div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanViewModal
