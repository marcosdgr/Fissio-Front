// Modal para ver el comentario completo
const FeedbackModal = ({ show, comentario, onClose, onPublicar }) => {
  if (!show || !comentario) return null;

  const renderEstrellas = (calificacion) => {
    return '★'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const estaPublicado = comentario.IsPublicado === 1;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <span className="material-symbols-outlined me-2" style={{verticalAlign: 'middle'}}>
                  rate_review
                </span>
                Detalle del Comentario
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="modal-body">
              {/* Información del paciente */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">Paciente</h6>
                <p className="fs-5 fw-bold mb-0">{comentario.pacienteNombre || 'Sin nombre'}</p>
                <small className="text-muted">
                  {formatearFecha(comentario.FechaComentario)}
                </small>
              </div>

              {/* Calificación */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">Calificación</h6>
                <div className="d-flex align-items-center">
                  <span className="fs-4 fw-bold text-warning me-2">
                    {renderEstrellas(comentario.CalificacionComentario)}
                  </span>
                  <span className="text-muted">({comentario.CalificacionComentario}/5)</span>
                </div>
              </div>

              {/* Comentario completo */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">Comentario</h6>
                <div className="comentario-completo p-3 bg-light rounded">
                  <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                    {comentario.Comentario || 'Sin comentario'}
                  </p>
                </div>
              </div>

              {/* Estado de publicación */}
              <div className="mb-3">
                <h6 className="text-muted mb-2">Estado</h6>
                <div className="d-flex gap-2">
                  <span className={`badge ${comentario.IsActive === 1 ? 'bg-success' : 'bg-danger'}`}>
                    {comentario.IsActive === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className={`badge ${estaPublicado ? 'bg-primary' : 'bg-secondary'}`}>
                    {estaPublicado ? '✓ Publicado' : 'No publicado'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              {comentario.IsActive === 1 && (
                <button 
                  type="button" 
                  className={`btn ${estaPublicado ? 'btn-warning' : 'btn-primary'}`}
                  onClick={() => onPublicar(comentario)}
                >
                  {estaPublicado ? (
                    <>
                      <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>
                        visibility_off
                      </span>
                      Despublicar
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>
                        publish
                      </span>
                      Publicar en Home
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackModal;
