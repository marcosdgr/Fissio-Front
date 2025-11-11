const FeedbackFiltrar = ({ busqueda, filtroCalificacion, onBusquedaChange, onFiltroChange }) => {
  return (
    <div className="feedback-filtros mb-4">
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            {/* Búsqueda */}
            <div className="col-md-6">
              <label className="form-label fw-medium">
                <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>
                  search
                </span>
                Buscar
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por paciente o comentario..."
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
              />
            </div>

            {/* Filtro por calificación */}
            <div className="col-md-6">
              <label className="form-label fw-medium">
                <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>
                  star
                </span>
                Calificación
              </label>
              <select
                className="form-select"
                value={filtroCalificacion}
                onChange={(e) => onFiltroChange(e.target.value)}
              >
                <option value="todos">Todas las calificaciones</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
                <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
                <option value="3">⭐⭐⭐ (3 estrellas)</option>
                <option value="2">⭐⭐ (2 estrellas)</option>
                <option value="1">⭐ (1 estrella)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFiltrar;
