const PacientesModal = ({ 
  showModal, 
  modalMode, 
  formData, 
  pacientes,
  localidades,
  selectedPaciente,
  onInputChange, 
  onSave, 
  onClose 
}) => {
  const dniYaExiste = (dni) => {
    const dniLower = dni.toLowerCase().trim()
    return pacientes.some(paciente => {
      if (modalMode === 'edit' && paciente.idPaciente === selectedPaciente?.idPaciente) {
        return false
      }
      return paciente.DNI.toLowerCase() === dniLower
    })
  }

  if (!showModal) return null

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">groups</span>
              {modalMode === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSave}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <h6 className="text-primary border-bottom pb-2 mb-0">
                    <span className="material-symbols-outlined me-1">person</span>
                    Información Personal
                  </h6>
                </div>
                
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="DNI" className="form-label">
                    DNI *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formData.DNI && dniYaExiste(formData.DNI) ? 'is-invalid' : ''}`}
                    id="DNI"
                    name="DNI"
                    value={formData.DNI}
                    onChange={onInputChange}
                    required
                    placeholder="12345678"
                  />
                  {formData.DNI && dniYaExiste(formData.DNI) && (
                    <div className="invalid-feedback">
                      <i className="material-symbols-outlined me-1 error-icon">error</i>
                      Este DNI ya está registrado.
                    </div>
                  )}
                </div>
                
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="NombrePaciente" className="form-label">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="NombrePaciente"
                    name="NombrePaciente"
                    value={formData.NombrePaciente}
                    onChange={onInputChange}
                    required
                    placeholder="Juan"
                  />
                </div>
                
                <div className="col-lg-4">
                  <label htmlFor="ApellidoPaciente" className="form-label">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="ApellidoPaciente"
                    name="ApellidoPaciente"
                    value={formData.ApellidoPaciente}
                    onChange={onInputChange}
                    required
                    placeholder="Pérez"
                  />
                </div>
                
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="FechaNacPaciente" className="form-label">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="FechaNacPaciente"
                    name="FechaNacPaciente"
                    value={formData.FechaNacPaciente}
                    onChange={onInputChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 col-lg-4">
                  <label htmlFor="Sexo" className="form-label">
                    Sexo *
                  </label>
                  <select
                    className="form-select"
                    id="Sexo"
                    name="Sexo"
                    value={formData.Sexo}
                    onChange={onInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div className="col-lg-4">
                  <label htmlFor="TelefonoPaciente" className="form-label">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="TelefonoPaciente"
                    name="TelefonoPaciente"
                    value={formData.TelefonoPaciente}
                    onChange={onInputChange}
                    required
                    placeholder="1234567890"
                  />
                </div>
                <div className="col-12 mt-3">
                  <h6 className="text-primary border-bottom pb-2 mb-0">
                    <span className="material-symbols-outlined me-1">location_on</span>
                    Ubicación
                  </h6>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="idLocalidad" className="form-label">
                    Localidad *
                  </label>
                  <select
                    className="form-select"
                    id="idLocalidad"
                    name="idLocalidad"
                    value={formData.idLocalidad}
                    onChange={onInputChange}
                    required
                  >
                    <option value="">Seleccionar localidad...</option>
                    {localidades.map(localidad => (
                      <option key={localidad.idLocalidad} value={localidad.idLocalidad}>
                        {localidad.NombreLocalidad}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="DireccionPaciente" className="form-label">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="DireccionPaciente"
                    name="DireccionPaciente"
                    value={formData.DireccionPaciente}
                    onChange={onInputChange}
                    required
                    placeholder="Calle 123, Ciudad"
                  />
                </div>

                {modalMode === 'create' && (
                  <>
                    <div className="col-12 mt-3">
                      <h6 className="text-primary border-bottom pb-2 mb-0">
                        <span className="material-symbols-outlined me-1">account_circle</span>
                        Credenciales de Acceso
                      </h6>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="MailUsuario" className="form-label">
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="MailUsuario"
                        name="MailUsuario"
                        value={formData.MailUsuario}
                        onChange={onInputChange}
                        placeholder="ejemplo@correo.com"
                      />
                      <div className="form-text">Si no se especifica, se generará uno automático</div>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="PasswordUsuario" className="form-label">
                        Contraseña (opcional)
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="PasswordUsuario"
                        name="PasswordUsuario"
                        value={formData.PasswordUsuario}
                        onChange={onInputChange}
                        placeholder="Contraseña temporal"
                      />
                      <div className="form-text">Si no se especifica, se asignará "1234"</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
              <button type="button" className="btn btn-secondary order-2 order-sm-1" onClick={onClose}>
                <span className="material-symbols-outlined me-1">close</span>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-fissio-primary order-1 order-sm-2"
                disabled={!formData.DNI.trim() || !formData.NombrePaciente.trim() || 
                         dniYaExiste(formData.DNI)}
              >
                <span className="material-symbols-outlined me-1">save</span>
                {modalMode === 'create' ? 'Crear Paciente' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PacientesModal