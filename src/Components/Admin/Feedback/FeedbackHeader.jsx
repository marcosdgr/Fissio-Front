const FeedbackHeader = ({ totalComentarios }) => {
  return (
    <div className="feedback-header-admin mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">
            <span className="material-symbols-outlined me-2" style={{verticalAlign: 'middle'}}>
              rate_review
            </span>
            Comentarios de Pacientes
          </h2>
          <p className="text-muted mb-0">
            Gestiona las opiniones y calificaciones de los pacientes
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-primary fs-5 px-3 py-2">
            {totalComentarios} comentario{totalComentarios !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHeader;
