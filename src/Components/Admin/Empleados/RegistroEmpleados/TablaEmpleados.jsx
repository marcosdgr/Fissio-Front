const TablaEmpleados = ({ empleados, loading, onView, onEdit, onToggle }) => {
  return (
    <div className="servicios-table">
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Localidad</th>
                    <th>Categoría</th>
                    <th>Rol</th>
                    <th>Salario</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados && empleados.length > 0 ? empleados.map(emp => (
                    <tr key={emp.idEmpleado ?? emp.id}>
                      <td className="fw-medium">{emp.DNI}</td>
                      <td>{emp.NombreEmpleado}</td>
                      <td>{emp.ApellidoEmpleado}</td>
                      <td>{emp.NombreLocalidad || '-'}</td>
                      <td>{emp.NombreCat || '-'}</td>
                      <td>{emp.PermisosEmpleado || '-'}</td>
                      <td>{emp.SalarioEmpleado}</td>
                      <td><span className={`badge ${emp.IsActive ? 'bg-success' : 'bg-danger'}`}>{emp.IsActive ? 'Activo' : 'Inactivo'}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => onView(emp)} title="Ver"><span className="material-symbols-outlined">visibility</span></button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(emp)} title="Editar"><span className="material-symbols-outlined">edit</span></button>
                          <button className={`btn btn-sm ${emp.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => onToggle(emp)} title={emp.IsActive ? 'Desactivar' : 'Activar'}>
                            {emp.IsActive ? <span className="material-symbols-outlined">block</span> : <span className="material-symbols-outlined">check_circle</span>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="9" className="text-center py-4"><span className="material-symbols-outlined fs-1 text-muted">badge</span><p className="text-muted mt-2">No hay empleados que coincidan con los filtros</p></td></tr>
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

export default TablaEmpleados
