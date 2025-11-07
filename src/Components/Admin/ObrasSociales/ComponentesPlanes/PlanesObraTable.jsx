import React from 'react'

const safeGetDescripcion = (o) => o?.DescripcionPlan ?? o?.['DescripciónPlan'] ?? ''

const PlanesObraTable = ({ planes = [], loading = false, searchQuery = '', onEdit, onView }) => {
  const lista = (planes || []).filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (p.NombraPlan || '').toLowerCase().includes(q) ||
      (safeGetDescripcion(p) || '').toLowerCase().includes(q) ||
      String(p.idPlanObra || '').includes(q) ||
      String(p.idObraSocial || '').includes(q)
    )
  })

  if (!lista.length && !loading) {
    return (
      <div className="text-center text-secondary">No hay planes de obra registrados</div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>idObraSocial</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((p) => (
            <tr key={p.idPlanObra}>
              <td>{p.idPlanObra}</td>
              <td>{p.NombraPlan || p.NombrePlan}</td>
              <td>{safeGetDescripcion(p)}</td>
              <td>{p.idObraSocial}</td>
              <td>
                <div className="btn-group" role="group">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit && onEdit(p)}>Editar</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => onView && onView(p)}>Ver</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PlanesObraTable
