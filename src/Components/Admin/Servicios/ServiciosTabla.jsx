const ServiciosTabla = ({ serviciosFiltrados, loading, onEdit, onToggleStatus }) => {
  return (
    <div className="servicios-table">
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
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosFiltrados.length > 0 ? (
                    serviciosFiltrados.map(servicio => (
                      <tr key={servicio.idServicio}>
                        <td className="fw-medium">{servicio.NombreServicio}</td>
                        <td>{servicio.DescripcionServicio}</td>
                        <td>
                          <span className={`badge ${servicio.IsActive ? 'bg-success' : 'bg-danger'}`}>
                            {servicio.IsActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onEdit(servicio)}
                              title="Editar servicio"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button 
                              className={`btn btn-sm ${servicio.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => onToggleStatus(servicio)}
                              title={servicio.IsActive ? 'Desactivar servicio' : 'Activar servicio'}
                            >
                              {servicio.IsActive ? (
                                <span className="material-symbols-outlined">block</span>
                              ) : (
                                <span className="material-symbols-outlined">check_circle</span>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <span className="material-symbols-outlined fs-1 text-muted">medical_services</span>
                        <p className="text-muted mt-2">No hay servicios que coincidan con los filtros</p>
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
  )
}

export default ServiciosTabla