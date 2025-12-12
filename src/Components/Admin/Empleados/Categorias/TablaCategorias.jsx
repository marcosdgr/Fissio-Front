const TablaCategorias = ({ categorias, loading, onEdit, onToggle }) => {
  return (
    <div className="servicios-table">
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
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
                  {categorias && categorias.length > 0 ? (
                    categorias.map(cat => (
                      <tr key={cat.idCatEmpleado ?? cat.id}>
                        <td className="fw-medium">{cat.NombreCat || cat.NombreCategoria}</td>
                        <td>{cat.DescripcionCat || cat.DescripcionCategoria}</td>
                        <td><span className={`badge ${cat.IsActive ? 'bg-success' : 'bg-danger'}`}>{cat.IsActive ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(cat)} title="Editar categoría"><span className="material-symbols-outlined">edit</span></button>
                            <button className={`btn btn-sm ${cat.IsActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => onToggle(cat)} title={cat.IsActive ? 'Desactivar' : 'Activar'}>
                              {cat.IsActive ? <span className="material-symbols-outlined">block</span> : <span className="material-symbols-outlined">check_circle</span>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <span className="material-symbols-outlined fs-1 text-muted">groups</span>
                        <p className="text-muted mt-2">No hay categorías que coincidan con los filtros</p>
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

export default TablaCategorias
