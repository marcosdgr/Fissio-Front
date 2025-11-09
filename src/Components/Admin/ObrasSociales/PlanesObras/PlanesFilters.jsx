import React from 'react'

const PlanesFilters = ({ obraFilter, setObraFilter, obrasSociales, query, setQuery, estadoFilter, setEstadoFilter, onAdd }) => {
  return (
    <>
      <div className="planes-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="planes-title"><span className="material-symbols-outlined me-2">article</span>Planes de Obras Sociales <small className="text-muted ms-2">({obrasSociales?obrasSociales.length:0} obras)</small></h2>
          <p className="planes-subtitle">Gestiona planes asociados a cada obra social</p>
        </div>
        <div>
          <button className="btn btn-fissio-primary" onClick={onAdd}><span className="material-symbols-outlined me-1">add</span>Agregar Plan</button>
        </div>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-4 mb-2">
          <select className="form-select" value={obraFilter} onChange={e => setObraFilter(e.target.value)}>
            <option value="">Todas las obras sociales</option>
            {obrasSociales.map(o => <option key={o.idObraSocial ?? o.id} value={o.idObraSocial ?? o.id}>{o.NombreObraSocial ?? o.Nombre ?? o.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-5 mb-2">
          <input className="form-control" placeholder="Buscar por nombre o descripción" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Vigente">Vigente</option>
            <option value="No vigente">No vigente</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default PlanesFilters
