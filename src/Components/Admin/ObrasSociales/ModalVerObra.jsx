const ModalVerObra = ({ open, onClose, obra }) => {
  if (!open || !obra) return null
  return (
    <div className="modal show d-block modal-obras-overlay">
      <div className="modal-dialog modal-ver-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-ver-header">
            <h5 className="modal-title">{obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="ver-field">
              <div className="ver-field-label">Teléfono</div>
              <div className="ver-field-value">{obra.TelefonoObra ?? obra.telefono}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Email</div>
              <div className="ver-field-value">{obra.EmailObra ?? obra.email}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Página web</div>
              <div className="ver-field-value">{obra.PaginaWebObra ?? obra.PaginaWeb ?? ''}</div>
            </div>
            <div className="ver-field mt-3">
              <div className="ver-field-label">Estado</div>
              <div className="ver-field-value">{obra.EstadoObra ?? (obra.IsActive ? 'Activa' : 'Suspendida')}</div>
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

export default ModalVerObra
