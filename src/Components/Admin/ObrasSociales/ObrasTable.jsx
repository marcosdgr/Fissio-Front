import React from 'react'

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
                  const estadoReal = obra.EstadoObra ?? obra.estado ?? (obra.IsActive ? 'Activa' : 'Suspendida')
                  const badgeClass = estadoReal === 'Activa' ? 'bg-success' : 'bg-warning text-dark'
                  const isActive = obra.IsActive !== undefined ? Boolean(obra.IsActive) : (estadoReal && estadoReal.toLowerCase().includes('act'))
                  return (
                    <tr key={id || Math.random()}>
                      <td className="fw-medium">{nombre}</td>
                      <td>{telefono}</td>
                      <td>{email}</td>
                      <td><span className={`badge ${badgeClass}`}>{estadoReal}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info" onClick={() => onView(obra)}>Ver</button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(obra)}>Editar</button>
                          <button className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => onToggle(obra)}>{isActive ? 'Desactivar' : 'Activar'}</button>
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
