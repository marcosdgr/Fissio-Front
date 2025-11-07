import React from 'react'

const ObrasSocialesTable = ({ obrasSociales = [], loading = false, searchQuery = '', onEdit = () => {}, onView = () => {} }) => {

  //busqueda de obras sociales
  const lista = (obrasSociales || []).filter((o) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (o.NombreObraSocial || '').toLowerCase().includes(q) ||
      (o.TelefonoObra || '').toLowerCase().includes(q) ||
      (o.EmailObra || '').toLowerCase().includes(q) ||
      (o.PaginaWebObra || '').toLowerCase().includes(q)
    )
  })

  if (lista.length === 0 && !loading) {
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <tbody>
            <tr>
              <td colSpan={7} className="text-center text-secondary">
                No hay obras sociales registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Página</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((o) => {
            const estado = o?.EstadoObra || 'Activa'
            const badgeClass = estado === 'Activa' ? 'badge bg-success' : estado === 'Suspendida' ? 'badge bg-warning text-dark' : 'badge bg-danger'
            return (
              <tr key={o.idObraSocial}>
                <td>{o.idObraSocial}</td>
                <td>{o.NombreObraSocial}</td>
                <td>{o.TelefonoObra}</td>
                <td>{o.EmailObra}</td>
                <td>{o.PaginaWebObra}</td>
                <td>
                  <span className={badgeClass}>{estado}</span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(o)}>
                      Editar
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => onView(o)}>
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ObrasSocialesTable
