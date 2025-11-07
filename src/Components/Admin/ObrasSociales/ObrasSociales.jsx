import React from 'react'
import CrudObrasSociales from './CrudObras'
import CrudPlanesObra from './CrudPlanesObra'

const ObrasSociales = () => {
  return (
    <div className="p-5 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800">Obras Sociales</h2>
      <CrudObrasSociales />
      <div style={{ height: 12 }} />
      <CrudPlanesObra />
    </div>
  )
}

export default ObrasSociales
