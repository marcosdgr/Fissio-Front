const PacientesTabla = ({ pacientesFiltrados, loading, onEdit, onToggleStatus, onViewDetails }) => {
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
                    <th>DNI</th>
                    <th>Nombre Completo</th>
                    <th>Teléfono</th>
                    <th>Localidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.length > 0 ? (
                    pacientesFiltrados.map(paciente => (
                      <tr key={paciente.idPaciente}>
                        <td className="fw-medium">{paciente.DNI}</td>
                        <td>{paciente.NombrePaciente} {paciente.ApellidoPaciente}</td>
                        <td>{paciente.TelefonoPaciente}</td>
                        <td>{paciente.NombreLocalidad}</td>
                        <td>
                          <span className={`badge ${paciente.IsActive ? 'bg-success' : 'bg-danger'}`}>
                            {paciente.IsActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => onViewDetails(paciente)}
                              title="Ver detalles del paciente"
                            >
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onEdit(paciente)}
                              title="Editar paciente"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button 
                              className={`btn btn-sm ${paciente.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => onToggleStatus(paciente)}
                              title={paciente.IsActive ? 'Desactivar paciente' : 'Activar paciente'}
                            >
                              {paciente.IsActive ? (
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
                      <td colSpan="6" className="text-center py-4">
                        <span className="material-symbols-outlined fs-1 text-muted">groups</span>
                        <p className="text-muted mt-2">No hay pacientes que coincidan con los filtros</p>
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

export default PacientesTabla