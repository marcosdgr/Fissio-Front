const ServiciosEstado = ({ servicios, filtro, onFiltroChange }) => {
  const totalServicios = servicios.length
  const serviciosActivos = servicios.filter(s => s.IsActive).length
  const serviciosInactivos = servicios.filter(s => !s.IsActive).length

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('todos')}
          title="Clic para ver todos los servicios"
        >
          <div className="card-body">
            <h5 className="stats-value">{totalServicios}</h5>
            <p className="stats-title">Total Servicios</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('activos')}
          title="Clic para ver solo servicios activos"
        >
          <div className="card-body">
            <h5 className="stats-value text-success">{serviciosActivos}</h5>
            <p className="stats-title">Activos</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`}
          onClick={() => onFiltroChange('inactivos')}
          title="Clic para ver solo servicios inactivos"
        >
          <div className="card-body">
            <h5 className="stats-value text-danger">{serviciosInactivos}</h5>
            <p className="stats-title">Inactivos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiciosEstado