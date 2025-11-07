import React, { useMemo } from 'react';
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales';
import { showError, showSuccess } from '../../../Utils/sweetAlerts';

const TablaObrasSociales = ({ onView, onEdit }) => {
  const {
    obrasSociales,
    loading,
    error,
    obtenerTodasLasObrasSociales,
    borradoLogicoObraSocial,
  } = useCustomObrasSociales();



  const handleToggle = async (obra) => {
    const id = obra?.id ?? obra?.idObraSocial ?? obra?.id_obrasocial;
    try {
      const resp = await borradoLogicoObraSocial(id);
      if (resp?.success === false) throw new Error(resp.error || 'Error al cambiar estado');
      showSuccess('Hecho', 'Estado actualizado');
      // refrescar todas por seguridad
      obtenerTodasLasObrasSociales();
    } catch (err) {
      console.error(err);
      showError('Error', err.message || 'No se pudo cambiar el estado');
    }
  };

  const rows = useMemo(() => (obrasSociales || []), [obrasSociales]);

  if (loading) return (
    <div className="text-center py-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger">Error al cargar obras sociales</div>;

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">No hay obras registradas</td>
            </tr>
          )}
          {rows.map((obra) => {
            // inline (trainee-level) field access
            const id = obra?.id ?? obra?.idObraSocial ?? obra?.id_obrasocial;
            const nombre = obra?.NombreObraSocial ?? obra?.Nombre ?? obra?.nombre ?? obra?.name ?? '';
            const estado = obra?.EstadoObra ?? obra?.estado ?? (obra?.IsActive !== undefined ? (obra.IsActive ? 'Activa' : 'Baja') : (obra?.isActive !== undefined ? (obra.isActive ? 'Activa' : 'Baja') : 'Desconocido'));
            const isActiveFlag = obra?.IsActive !== undefined ? Boolean(obra.IsActive) : (obra?.isActive !== undefined ? Boolean(obra.isActive) : null);
            const isActive = isActiveFlag === null ? estado.toLowerCase().includes('act') : isActiveFlag;
            return (
              <tr key={id || Math.random()}>
                <td>{id}</td>
                <td>{nombre}</td>
                <td>
                  <span className={`badge bg-${estado.toLowerCase().includes('act') ? 'success' : estado.toLowerCase().includes('susp') ? 'warning' : 'secondary'}`}>
                    {estado}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => (onView ? onView(obra) : alert(JSON.stringify(obra, null, 2)))}>Ver</button>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => onEdit ? onEdit(obra) : null}>Editar</button>
                  <button className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => handleToggle(obra)}>
                    {isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaObrasSociales;
