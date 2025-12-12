const FeedbackTabla = ({ comentariosFiltrados, loading, onVerComentario }) => {
  const renderEstrellas = (calificacion) => {
    return '★'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCalificacionColor = (calificacion) => {
    if (calificacion >= 4) return 'text-success';
    if (calificacion === 3) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="feedback-table">
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Paciente</th>
                    <th>Calificación</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comentariosFiltrados.length > 0 ? (
                    comentariosFiltrados.map(comentario => (
                      <tr key={comentario.idComentario}>
                        <td className="fw-medium">{comentario.NombrePaciente || 'Sin nombre'}</td>
                        <td>
                          <span className={`fw-bold ${getCalificacionColor(comentario.CalificacionComentario)}`}>
                            {renderEstrellas(comentario.CalificacionComentario)}
                          </span>
                          <span className="text-muted ms-2">
                            ({comentario.CalificacionComentario}/5)
                          </span>
                        </td>
                        <td>
                          <div className="comentario-text" title={comentario.Comentario}>
                            {comentario.Comentario?.length > 100 
                              ? comentario.Comentario.substring(0, 100) + '...'
                              : comentario.Comentario || 'Sin comentario'}
                          </div>
                        </td>
                        <td className="text-muted">
                          {formatearFecha(comentario.FechaComentario)}
                        </td>
                        <td>
                          {comentario.IsPublicado === 1 ? (
                            <span className="badge bg-primary">Publicado</span>
                          ) : (
                            <span className="badge bg-secondary">No publicado</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onVerComentario(comentario)}
                            title="Ver comentario completo"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <span className="material-symbols-outlined fs-1 text-muted">rate_review</span>
                        <p className="text-muted mt-2">No hay comentarios que coincidan con los filtros</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTabla;
