const PacientesEstado = ({ pacientes, pacientesFiltrados, filtro, onFiltroChange }) => {
  const totalPacientes = pacientes.length
  const pacientesActivos = pacientes.filter(p => p.IsActive).length
  const pacientesInactivos = pacientes.filter(p => !p.IsActive).length
  const totalFiltrados = pacientesFiltrados?.length || 0

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('todos')}
          title="Clic para ver todos los pacientes"
        >
          <div className="card-body">
            <h5 className="stats-value">{totalPacientes}</h5>
            <p className="stats-title">Total Pacientes</p>
            {totalFiltrados !== totalPacientes && (
              <small className="text-muted d-block">
                ({totalFiltrados} {totalFiltrados === 1 ? 'resultado' : 'resultados'})
              </small>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('activos')}
          title="Clic para ver solo pacientes activos"
        >
          <div className="card-body">
            <h5 className="stats-value text-success">{pacientesActivos}</h5>
            <p className="stats-title">Activos</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('inactivos')}
          title="Clic para ver solo pacientes inactivos"
        >
          <div className="card-body">
            <h5 className="stats-value text-danger">{pacientesInactivos}</h5>
            <p className="stats-title">Inactivos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PacientesEstado