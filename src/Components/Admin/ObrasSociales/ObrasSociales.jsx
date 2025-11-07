import React, { useState } from 'react'
import TablaObrasSociales from './TablaObrasSociales'
import BusquedaObrasSociales from './BusquedaObrasSociales'
import ModalCrearObraSocial from './ModalCrearObraSocial'
import CardsFiltroObras from './CardsFiltroObras'
import '../../../Css/Admin/Servicios/Servicios.css'

const ObrasSociales = () => {
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('Todas');

  return (
    <div className="servicios-container">
      <div className="servicios-header">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="servicios-title">
              <span className="material-symbols-outlined me-2">health_and_safety</span>
              Gestión de Obras Sociales
            </h2>
            <p className="servicios-subtitle">Administra las obras sociales y su estado</p>
          </div>
          <button className="btn btn-fissio-primary" onClick={() => setIsCreateOpen(true)}>
            <span className="material-symbols-outlined me-1">add</span>
            Agregar Obra
          </button>
        </div>

        {/* Cards de estadisticas (reusa el componente ya creado) */}
        <div className="row mb-4">
          <div className="col-12">
            <CardsFiltroObras selected={statusFilter} onSelect={(v) => setStatusFilter(v)} />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda con estilo servicios */}
      <div className="servicios-filters">
        <div className="row mb-3">
          <div className="col-md-8">
            <BusquedaObrasSociales onSearch={setQuery} />
          </div>
          <div className="col-md-4 d-flex align-items-center justify-content-end">
            {/* opcional: select de filtro que mantiene compatibilidad con CardsFiltroObras */}
            <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todas">🔍 Todas</option>
              <option value="Activas">✅ Activas</option>
              <option value="Inactivas">❌ Inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="servicios-table">
        <TablaObrasSociales query={query} refreshKey={refreshKey} statusFilter={statusFilter} />
      </div>

      <ModalCrearObraSocial
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          // signal tabla to refresh
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  )
}

export default ObrasSociales
