import React from 'react'

const EstadoBadge = ({ estado }) => {
  const vig = (estado ?? 'Vigente') === 'Vigente'
  return <span className={`badge ${vig ? 'bg-success' : 'bg-warning text-dark'}`}>{estado ?? 'Vigente'}</span>
}

const PlanesTable = ({ visible, obrasSociales, openView, openEdit, onToggle }) => {
  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>% Descuento</th>
                  <th>Obra social</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.length > 0 ? visible.map(plan => {
                  const id = plan.idPlanObra ?? plan.idPlan ?? plan.id
                  const nombre = plan.NombraPlan ?? plan.nombre ?? ''
                  const porcentaje = plan.PorcentajeDescuentoPlan ?? plan.Porcentaje ?? ''
                  const obraKey = String(plan.idObraSocial ?? plan.id_obraSocial ?? plan.idObra ?? '')
                  const obraObj = obrasSociales.find(o => String(o.idObraSocial ?? o.id) === obraKey)
                  const obraName = plan.NombreObraSocial ?? obraObj?.NombreObraSocial ?? obraObj?.Nombre ?? obraObj?.nombre ?? ''
                  const isVigente = (plan.EstadoPlan ?? (plan.IsActive !== undefined ? (plan.IsActive ? 'Vigente' : 'No vigente') : 'Vigente')) === 'Vigente'
                  return (
                    <tr key={id || Math.random()}>
                      <td className="fw-medium">{nombre}</td>
                      <td>{porcentaje}</td>
                      <td>{obraName}</td>
                      <td><EstadoBadge estado={plan.EstadoPlan ?? 'Vigente'} /></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => openView(plan)}>
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => openEdit(plan)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className={`btn btn-sm ${isVigente ? 'btn-outline-danger' : 'btn-outline-success'}`} title={isVigente ? 'Desactivar' : 'Activar'} onClick={() => onToggle(plan)}>
                            <span className="material-symbols-outlined">{isVigente ? 'block' : 'check_circle'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={5} className="text-center py-4">No hay planes que coincidan con los filtros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="planes-cards">
        {visible.map(plan => (
          <div className="plan-card" key={(plan.idPlanObra ?? plan.id) || Math.random()}>
            <div className="d-flex justify-content-between">
              <div>
                <strong>{plan.NombraPlan ?? plan.nombre}</strong>
                <div className="meta">{plan.PorcentajeDescuentoPlan ?? ''}%</div>
                <div className="meta">Estado: <EstadoBadge estado={plan.EstadoPlan ?? 'Vigente'} /></div>
              </div>
              <div className="text-end">
                <span className={`badge ${plan.IsActive ? 'bg-success' : 'bg-warning text-dark'}`}>{plan.IsActive ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => openView(plan)}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => openEdit(plan)}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className={`btn btn-sm ${((plan.EstadoPlan ?? (plan.IsActive ? 'Vigente' : 'No vigente')) === 'Vigente') ? 'btn-outline-danger' : 'btn-outline-success'}`} title={((plan.EstadoPlan ?? (plan.IsActive ? 'Vigente' : 'No vigente')) === 'Vigente') ? 'Desactivar' : 'Activar'} onClick={() => onToggle(plan)}>
                <span className="material-symbols-outlined">{((plan.EstadoPlan ?? (plan.IsActive ? 'Vigente' : 'No vigente')) === 'Vigente') ? 'block' : 'check_circle'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PlanesTable
