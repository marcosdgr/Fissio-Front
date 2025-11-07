import React from 'react'

const FiltrosObrasSociales = ({ searchQuery, onSearchChange, onSearchSubmit, activeFilter, onTodas, onActivas, onInactivas }) => {
  return (
    <div className="mb-3">
      <div className="row align-items-center gx-2">
        <div className="col-12 col-md-7">
          <form onSubmit={onSearchSubmit} aria-label="buscar-obras">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                className="form-control border-start-0"
                type="search"
                placeholder="Buscar obra, teléfono o email"
                aria-label="Buscar"
                value={searchQuery}
                onChange={onSearchChange}
                style={{ borderRadius: '0.6rem', padding: '0.6rem 0.9rem', fontSize: '0.95rem' }}
              />
              <button className="btn btn-primary ms-2 d-none d-md-inline" type="submit" style={{ borderRadius: '0.6rem' }}>Buscar</button>
            </div>
            {/* small screen: show search button below input */}
            <div className="d-md-none mt-2 d-flex justify-content-end">
              <button className="btn btn-primary btn-sm" type="submit">Buscar</button>
            </div>
          </form>
        </div>

        <div className="col-12 col-md-5 mt-2 mt-md-0 d-flex justify-content-md-end gap-2">
          <div className="btn-group" role="group" aria-label="filtros-estado">
            <button type="button" className={`btn btn-sm ${activeFilter === 'todas' ? 'btn-info' : 'btn-outline-info'}`} onClick={onTodas}>
              Todas
            </button>
            <button type="button" className={`btn btn-sm ${activeFilter === 'activa' ? 'btn-success' : 'btn-outline-success'}`} onClick={onActivas}>
              Activas
            </button>
            <button type="button" className={`btn btn-sm ${activeFilter === 'inactiva' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={onInactivas}>
              Inactivas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiltrosObrasSociales
