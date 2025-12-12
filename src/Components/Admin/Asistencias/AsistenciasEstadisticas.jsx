const AsistenciasEstadisticas = ({ estadisticas }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="stats-card card text-center">
          <div className="card-body">
            <h5 className="stats-value">{estadisticas.total}</h5>
            <p className="stats-title">Total Registros</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="stats-card card text-center">
          <div className="card-body">
            <h5 className="stats-value text-success">{estadisticas.completas}</h5>
            <p className="stats-title">Jornadas Completas</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="stats-card card text-center">
          <div className="card-body">
            <h5 className="stats-value text-warning">{estadisticas.incompletas}</h5>
            <p className="stats-title">Jornadas Incompletas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciasEstadisticas;
