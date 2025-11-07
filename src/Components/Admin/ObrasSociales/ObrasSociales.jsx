import React, { useState } from 'react'
import TablaObrasSociales from './TablaObrasSociales'
import BusquedaObrasSociales from './BusquedaObrasSociales'

const ObrasSociales = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="p-5 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800">Obras Sociales</h2>
      <BusquedaObrasSociales onSearch={setQuery} />
      <TablaObrasSociales query={query} />

    </div>
  )
}

export default ObrasSociales
