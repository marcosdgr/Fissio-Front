import React from 'react'

const EstadisticasEmpleados = ({ total, activos, inactivos, filtro, setFiltro }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className={`stats-card card text-center clickable ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')} title="Ver todos">
          <div className="card-body">
            <h5 className="stats-value">{total}</h5>
            <p className="stats-title">Total Empleados</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`stats-card card text-center clickable ${filtro === 'activos' ? 'active' : ''}`} onClick={() => setFiltro('activos')} title="Activos">
          <div className="card-body">
            <h5 className="stats-value text-success">{activos}</h5>
            <p className="stats-title">Activos</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`stats-card card text-center clickable ${filtro === 'inactivos' ? 'active' : ''}`} onClick={() => setFiltro('inactivos')} title="Inactivos">
          <div className="card-body">
            <h5 className="stats-value text-danger">{inactivos}</h5>
            <p className="stats-title">Inactivos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasEmpleados
