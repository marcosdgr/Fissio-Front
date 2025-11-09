import React from 'react'

const ModalVerEmpleado = ({ showViewModal, viewEmpleado, onClose }) => {
  if (!showViewModal) return null
  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><span className="material-symbols-outlined me-2">badge</span>Detalle del Empleado</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4 mb-2"><strong>DNI</strong><div>{viewEmpleado?.DNI ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Nombre</strong><div>{viewEmpleado?.NombreEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Apellido</strong><div>{viewEmpleado?.ApellidoEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Fecha Nac.</strong><div>{viewEmpleado?.FechaNacEmpleado ? String(viewEmpleado.FechaNacEmpleado).split('T')?.[0] ?? viewEmpleado.FechaNacEmpleado : '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Teléfono</strong><div>{viewEmpleado?.TelefonoEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Dirección</strong><div>{viewEmpleado?.DireccionEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Localidad</strong><div>{viewEmpleado?.NombreLocalidad ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Categoría</strong><div>{viewEmpleado?.NombreCat ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Salario</strong><div>{viewEmpleado?.SalarioEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Rol del Empleado</strong><div>{viewEmpleado?.PermisosEmpleado ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Mail</strong><div>{viewEmpleado?.MailUsuario ?? '-'}</div></div>
              <div className="col-md-4 mb-2"><strong>Estado</strong><div><span className={`badge ${viewEmpleado?.IsActive ? 'bg-success' : 'bg-danger'}`}>{viewEmpleado?.IsActive ? 'Activo' : 'Inactivo'}</span></div></div>
            </div>
          </div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button></div>
        </div>
      </div>
    </div>
  )
}

export default ModalVerEmpleado
