const PacientesFiltrar = ({ busqueda, filtro, onBusquedaChange, onFiltroChange }) => {
  return (
    <div className="servicios-filters">
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
          >
            <option value="todos">👥 Todos los pacientes</option>
            <option value="activos">✅ Solo activos</option>
            <option value="inactivos">❌ Solo inactivos</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default PacientesFiltrar