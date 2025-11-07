import React, { useState } from 'react'
import TablaObrasSociales from './TablaObrasSociales'
import BusquedaObrasSociales from './BusquedaObrasSociales'
import ModalCrearObraSocial from './ModalCrearObraSocial'
import CardsFiltroObras from './CardsFiltroObras'

const ObrasSociales = () => {
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('Todas');

  return (
    <div className="p-5 bg-white rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-2xl font-bold text-gray-800">Gestion de Obras Sociales</h2>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>Agregar obra social</button>
      </div>
      <CardsFiltroObras selected={statusFilter} onSelect={(v) => setStatusFilter(v)} />
      <div className="mb-3">
        <BusquedaObrasSociales onSearch={setQuery} />
      </div>
      <TablaObrasSociales query={query} refreshKey={refreshKey} statusFilter={statusFilter} />

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
