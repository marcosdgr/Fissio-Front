import React from 'react'

const VerObraSocialModal = ({ open, onClose, obra = {} }) => {
  if (!open) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Datos de la Obra Social</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <div className="mb-2"><b>Nombre:</b> {obra.NombreObraSocial}</div>
            <div className="mb-2"><b>Teléfono:</b> {obra.TelefonoObra}</div>
            <div className="mb-2"><b>Email:</b> {obra.EmailObra}</div>
            <div className="mb-2"><b>Página web:</b> {obra.PaginaWebObra}</div>
            <div className="mb-2"><b>Estado:</b> {obra.EstadoObra}</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerObraSocialModal
