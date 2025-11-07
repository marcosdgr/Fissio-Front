import React from 'react'

const FiltrosPlanesObra = ({ searchQuery, onSearchChange, onSearchSubmit, activeFilter, onTodas, onActivas, onInactivas }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
      <form className="d-flex" onSubmit={onSearchSubmit} aria-label="buscar-planes">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar plan, id o descripción"
          aria-label="Buscar"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <button className="btn btn-outline-primary" type="submit">Buscar</button>
      </form>

      <div className="btn-group" role="group" aria-label="filtros-estado">
        <button type="button" className={`btn btn-sm ${activeFilter === 'todas' ? 'btn-info' : 'btn-outline-info'}`} onClick={onTodas}>Todas</button>
        <button type="button" className={`btn btn-sm ${activeFilter === 'activa' ? 'btn-success' : 'btn-outline-success'}`} onClick={onActivas}>Activas</button>
        <button type="button" className={`btn btn-sm ${activeFilter === 'inactiva' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={onInactivas}>Inactivas</button>
      </div>
    </div>
  )
}

export default FiltrosPlanesObra
