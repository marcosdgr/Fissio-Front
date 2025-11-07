import React from 'react';

const ModalVerObra = ({ isOpen, obra, onClose }) => {
  if (!isOpen || !obra) return null;

  const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '';
  const telefono = obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '';
  const email = obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '';
  const pagina = obra.PaginaWebObra ?? obra.PaginaWeb ?? obra.pagina ?? '';
  const estado = obra.EstadoObra ?? obra.estado ?? (obra.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Suspendida') : 'Activa');

  return (
    <div className="modal show d-block modal-ver-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="modal-dialog modal-ver-dialog" role="document">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header modal-ver-header">
            <div>
              <h5 className="modal-title">Detalles de la Obra Social</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => onClose && onClose()}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <h4 className="mb-1">{nombre}</h4>
                <div className="text-muted mb-3">Estado: <span className={`badge ${estado === 'Activa' ? 'bg-success' : 'bg-warning text-dark'}`}>{estado}</span></div>
              </div>

              <div className="col-md-6">
                <div className="ver-field-label">Teléfono</div>
                <div className="ver-field-value">{telefono || '-'}</div>
              </div>
              <div className="col-md-6">
                <div className="ver-field-label">Email</div>
                <div className="ver-field-value">{email || '-'}</div>
              </div>

              <div className="col-12">
                <div className="ver-field-label">Página web</div>
                <div className="ver-field-value">{pagina ? <a href={pagina} target="_blank" rel="noreferrer">{pagina}</a> : '-'}</div>
              </div>

              <div className="col-12 mt-3">
                <div className="alert alert-light small">Esta vista es de solo lectura. Usa el botón <strong>Editar</strong> si necesitas modificar los datos.</div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={() => onClose && onClose()}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerObra;
