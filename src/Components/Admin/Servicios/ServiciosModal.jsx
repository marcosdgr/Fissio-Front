const ServiciosModal = ({ 
  showModal, 
  modalMode, 
  formData, 
  servicios,
  selectedServicio,
  onInputChange, 
  onSave, 
  onClose 
}) => {
  // Validar si el nombre ya existe (sin considerar mayúsculas/minúsculas)
  const nombreYaExiste = (nombre) => {
    const nombreLower = nombre.toLowerCase().trim()
    return servicios.some(servicio => {
      // Si estamos editando, excluir el servicio actual
      if (modalMode === 'edit' && servicio.idServicio === selectedServicio?.idServicio) {
        return false
      }
      return servicio.NombreServicio.toLowerCase() === nombreLower
    })
  }

  if (!showModal) return null

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">medical_services</span>
              {modalMode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSave}>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="NombreServicio" className="form-label">
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formData.NombreServicio && nombreYaExiste(formData.NombreServicio) ? 'is-invalid' : ''}`}
                    id="NombreServicio"
                    name="NombreServicio"
                    value={formData.NombreServicio}
                    onChange={onInputChange}
                    required
                    placeholder="Ej: Rehabilitación de rodilla"
                  />
                  {formData.NombreServicio && nombreYaExiste(formData.NombreServicio) && (
                    <div className="invalid-feedback">
                      <i className="material-symbols-outlined me-1 error-icon">error</i>
                      Este nombre ya está en uso. Por favor, elige uno diferente.
                    </div>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <label htmlFor="DescripcionServicio" className="form-label">
                    Descripción del Servicio *
                  </label>
                  <textarea
                    className="form-control"
                    id="DescripcionServicio"
                    name="DescripcionServicio"
                    rows="4"
                    value={formData.DescripcionServicio}
                    onChange={onInputChange}
                    required
                    placeholder="Describe el servicio de kinesiología..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-fissio-primary"
                disabled={!formData.NombreServicio.trim() || nombreYaExiste(formData.NombreServicio)}
              >
                <span className="material-symbols-outlined me-1">save</span>
                {modalMode === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ServiciosModal