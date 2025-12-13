const ObrasTable = ({ visible = [], onView = () => {}, onEdit = () => {}, onToggle = () => {} }) => {
  return (
    <div className="servicios-table">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.length > 0 ? visible.map(obra => {
                  const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial
                  const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? ''
                  const telefono = obra.TelefonoObra ?? obra.telefono ?? ''
                  const email = obra.EmailObra ?? obra.email ?? ''
                  // Determinar si está activa primero
                  const isActive = obra.IsActive === 1 || obra.IsActive === true || obra.IsActive === '1'
                  const estadoReal = isActive ? 'Activa' : 'Suspendida'
                  const badgeClass = isActive ? 'bg-success' : 'bg-warning text-dark'
                  return (
                    <tr key={id || Math.random()}>
                      <td className="fw-medium">{nombre}</td>
                      <td>{telefono}</td>
                      <td>{email}</td>
                      <td><span className={`badge ${badgeClass}`}>{estadoReal}</span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => onView(obra)}>
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => onEdit(obra)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} title={isActive ? 'Desactivar' : 'Activar'} onClick={() => onToggle(obra)}>
                            <span className="material-symbols-outlined">{isActive ? 'block' : 'check_circle'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={5} className="text-center py-4"><span className="material-symbols-outlined fs-1 text-muted">account_balance</span><p className="text-muted mt-2">No hay obras sociales que coincidan con los filtros</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObrasTable
