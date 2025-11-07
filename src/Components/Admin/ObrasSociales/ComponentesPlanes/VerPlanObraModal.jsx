import React from 'react'

const VerPlanObraModal = ({ open, onClose, plan }) => {
  if (!open) return null

  const descripcion = plan?.DescripcionPlan ?? plan?.['DescripciónPlan'] ?? ''
  const obraNombre = plan?.NombreObraSocial ?? plan?.NombreObra ?? ''
  const isActive = plan?.IsActive

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Datos del Plan</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <div className="mb-2"><b>ID:</b> {plan?.idPlanObra}</div>
            <div className="mb-2"><b>Nombre:</b> {plan?.NombraPlan}</div>
            <div className="mb-2"><b>Descripción:</b> {descripcion}</div>
            <div className="mb-2"><b>Obra social:</b> {obraNombre}</div>
            <div className="mb-2"><b>Estado:</b> {typeof isActive !== 'undefined' ? (
              isActive === 1 || isActive === true || String(isActive) === '1'
                ? <span className="badge bg-success">Activa</span>
                : <span className="badge bg-danger">Inactiva</span>
            ) : '—'}</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerPlanObraModal
