const PacientesDetalleModal = ({ showModal, pacienteDetalle, onClose }) => {
  if (!showModal || !pacienteDetalle) return null

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">person</span>
              Detalles del Paciente
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <span className="material-symbols-outlined me-1">person</span>
                  Información Personal
                </h6>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">DNI:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.DNI}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Nombre Completo:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.NombrePaciente} {pacienteDetalle.ApellidoPaciente}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Fecha de Nacimiento:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {new Date(pacienteDetalle.FechaNacPaciente).toLocaleDateString('es-ES')}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Sexo:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.Sexo === 'M' ? 'Masculino' : 
                   pacienteDetalle.Sexo === 'F' ? 'Femenino' : 
                   pacienteDetalle.Sexo}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Teléfono:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.TelefonoPaciente}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Estado:</label>
                <p className="mb-0">
                  <span className={`badge ${pacienteDetalle.IsActive ? 'bg-success' : 'bg-danger'} fs-6`}>
                    {pacienteDetalle.IsActive ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
              
              <div className="col-12">
                <label className="form-label fw-bold text-muted">Dirección:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.DireccionPaciente}
                </p>
              </div>
              
              <div className="col-12">
                <label className="form-label fw-bold text-muted">Localidad:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.NombreLocalidad || 'No especificada'}
                </p>
              </div>

              <div className="col-12 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <span className="material-symbols-outlined me-1">account_circle</span>
                  Credenciales de Acceso
                </h6>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Email:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  {pacienteDetalle.MailUsuario || 'No disponible'}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">Contraseña:</label>
                <div className="bg-light rounded px-3 py-2 d-flex align-items-center">
                  <span className="text-muted me-2">••••••••</span>
                  <small className="text-info">
                    {pacienteDetalle.PasswordTemporal ? '(Temporal: 1234)' : '(Personalizada)'}
                  </small>
                </div>
              </div>

              <div className="col-12 mt-4">
                <h6 className="text-primary border-bottom pb-2 mb-3">
                  <span className="material-symbols-outlined me-1">info</span>
                  Información Adicional
                </h6>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">ID Paciente:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  #{pacienteDetalle.idPaciente}
                </p>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted">ID Usuario:</label>
                <p className="form-control-plaintext bg-light rounded px-3 py-2 mb-0">
                  #{pacienteDetalle.idUsuario || 'No disponible'}
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <span className="material-symbols-outlined me-1">close</span>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PacientesDetalleModal