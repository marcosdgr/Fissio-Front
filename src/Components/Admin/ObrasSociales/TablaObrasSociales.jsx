import React from 'react'
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales'
import '../../../Css/ObrasSociales/TablaObrasSociales.css'
import { useMemo } from 'react'

const Servicios = ({ query = '' }) => {
  const { obrasSociales = [] } = useCustomObrasSociales();

  const visible = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return obrasSociales;
    return (obrasSociales || []).filter(o => {
      const nombre = (o.NombreObraSocial ?? o.Nombre ?? o.nombre ?? '').toString().toLowerCase();
      const telefono = (o.TelefonoObra ?? o.TelefonoObraSocial ?? o.telefono ?? '').toString().toLowerCase();
      const email = (o.EmailObra ?? o.EmailObraSocial ?? o.email ?? '').toString().toLowerCase();
      return nombre.includes(q) || telefono.includes(q) || email.includes(q);
    });
  }, [obrasSociales, query])

  return (
    <div className="p-5 bg-white rounded shadow">
      <h2 className="mb-4">Gestión de Obras Sociales</h2>

      {/* Tabla de obras sociales */}
        <div className="obras-table table-responsive">
          <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 ? (
              visible.map(obra => {
                const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial;
                // fallbacks para nombres de columna entre backend y front
                const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '';
                const telefono = obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '';
                const email = obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '';
                const estado = obra.EstadoObra ?? obra.estado ?? (obra.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Baja') : 'Activa');
                const isActive = obra.IsActive !== undefined ? Boolean(obra.IsActive) : (estado && estado.toLowerCase().includes('act'));

                return (
                  <tr key={id || Math.random()}>
                    <td>{nombre}</td>
                    <td>{telefono}</td>
                    <td>{email}</td>
                    <td>
                      <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                      <button className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}>
                        {isActive ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center">No hay obras Sociales</td>
              </tr>
            )}
          </tbody>
        </table>
  </div>

  {/* Mobile card view */}
      <div className="obras-cards">
        {obrasSociales.map(obra => {
          const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial;
          const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '';
          const telefono = obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '';
          const email = obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '';
          const estado = obra.EstadoObra ?? obra.estado ?? (obra.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Baja') : 'Activa');
          const isActive = obra.IsActive !== undefined ? Boolean(obra.IsActive) : (estado && estado.toLowerCase().includes('act'));
          return (
            <div className="obra-card" key={id || Math.random()}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{nombre}</strong>
                  <div className="meta">{telefono}</div>
                  <div className="meta">{email}</div>
                </div>
                <div className="text-end">
                  <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>{isActive ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-primary me-2">Ver</button>
                <button className="btn btn-sm btn-outline-secondary">Editar</button>
              </div>
            </div>
          )
        })}
      </div>
  </div>
  )
}

export default Servicios