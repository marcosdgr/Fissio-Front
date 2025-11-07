import React, { useMemo, useState } from 'react'
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales'
import ModalEditarObra from './ModalEditarObra'
import ModalVerObra from './ModalVerObra'
import '../../../Css/Admin/ObrasSociales/TablaObrasSociales.css'

const TablaObrasSociales = ({ query = '', refreshKey, statusFilter = 'Todas' }) => {
  const { obrasSociales = [], obtenerTodasLasObrasSociales } = useCustomObrasSociales();
  React.useEffect(() => {
    if (typeof refreshKey !== 'undefined') {
      // call the hook function to refresh list when refreshKey changes
      obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);
  const [selectedObra, setSelectedObra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewObra, setViewObra] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const visible = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    const base = (obrasSociales || []).filter(o => {
      if (statusFilter && statusFilter !== 'Todas') {
        if (statusFilter === 'Activas') return o.IsActive === 1 || o.IsActive === true || o.IsActive === '1';
        if (statusFilter === 'Inactivas') return o.IsActive === 0 || o.IsActive === false || o.IsActive === '0';
      }
      return true;
    });

    if (!q) return base;
    return base.filter(o => {
      const nombre = (o.NombreObraSocial ?? o.Nombre ?? o.nombre ?? '').toString().toLowerCase();
      const telefono = (o.TelefonoObra ?? o.TelefonoObraSocial ?? o.telefono ?? '').toString().toLowerCase();
      const email = (o.EmailObra ?? o.EmailObraSocial ?? o.email ?? '').toString().toLowerCase();
      return nombre.includes(q) || telefono.includes(q) || email.includes(q);
    });
  }, [obrasSociales, query, statusFilter])

  return (
    <>
      <div className="card">
        <div className="card-body">
          {/** Table responsive and styled like servicios */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
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
                    const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '';
                    const telefono = obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '';
                    const email = obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '';
                    const estadoReal = obra.EstadoObra ?? obra.estado ?? (obra.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Suspendida') : 'Activa');
                    const badgeClass = estadoReal === 'Activa' ? 'bg-success' : 'bg-warning text-dark';
                    const isActive = obra.IsActive !== undefined ? Boolean(obra.IsActive) : (estadoReal && estadoReal.toLowerCase().includes('act'));

                    return (
                      <tr key={id || Math.random()}>
                        <td className="fw-medium">{nombre}</td>
                        <td>{telefono}</td>
                        <td>{email}</td>
                        <td><span className={`badge ${badgeClass}`}>{estadoReal}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-info" onClick={() => { setViewObra(obra); setIsViewOpen(true); }} title="Ver">Ver</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedObra(obra); setIsModalOpen(true); }} title="Editar">Editar</button>
                            <button className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} title={isActive ? 'Desactivar' : 'Activar'}>{isActive ? 'Desactivar' : 'Activar'}</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <span className="material-symbols-outlined fs-1 text-muted">account_balance</span>
                      <p className="text-muted mt-2">No hay obras sociales que coincidan con los filtros</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="obras-cards mt-3">
        {visible.map(obra => {
          const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial;
          const nombre = obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '';
          const telefono = obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '';
          const email = obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '';
          const estado = obra.EstadoObra ?? obra.estado ?? (obra.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Suspendida') : 'Activa');
          const badgeClass = estado === 'Activa' ? 'bg-success' : 'bg-warning text-dark';
          return (
            <div className="obra-card" key={id || Math.random()}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{nombre}</strong>
                  <div className="meta">{telefono}</div>
                  <div className="meta">{email}</div>
                </div>
                <div className="text-end">
                  <span className={`badge ${badgeClass}`}>{estado}</span>
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-info me-2" onClick={() => { setViewObra(obra); setIsViewOpen(true); }}>Ver</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setSelectedObra(obra); setIsModalOpen(true); }}>Editar</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de edición */}
      <ModalEditarObra
        isOpen={isModalOpen}
        obra={selectedObra}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          // refrescar lista luego de guardar
          obtenerTodasLasObrasSociales && obtenerTodasLasObrasSociales();
        }}
      />
      {/* Modal de ver obra (solo lectura) */}
      <ModalVerObra
        isOpen={isViewOpen}
        obra={viewObra}
        onClose={() => setIsViewOpen(false)}
      />
    </>
  )
}

export default TablaObrasSociales