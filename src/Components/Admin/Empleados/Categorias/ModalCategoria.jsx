import React from 'react'

const ModalCategoria = ({ showModal, modalMode, formData, handleInputChange, handleSave, handleCloseModal, nombreYaExiste }) => {
  if (!showModal) return null
  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><span className="material-symbols-outlined me-2">groups</span>{modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="NombreCategoria" className="form-label">Nombre *</label>
                  <input id="NombreCategoria" name="NombreCategoria" className={`form-control ${formData.NombreCategoria && nombreYaExiste(formData.NombreCategoria) ? 'is-invalid' : ''}`} value={formData.NombreCategoria} onChange={handleInputChange} required placeholder="Ej: Fisioterapeuta" />
                  {formData.NombreCategoria && nombreYaExiste(formData.NombreCategoria) && <div className="invalid-feedback">Este nombre ya está en uso.</div>}
                </div>
                <div className="col-12 mb-3">
                  <label htmlFor="DescripcionCategoria" className="form-label">Descripción</label>
                  <textarea id="DescripcionCategoria" name="DescripcionCategoria" className="form-control" rows="4" value={formData.DescripcionCategoria} onChange={handleInputChange} placeholder="Descripción de la categoría (opcional)"></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              <button type="submit" className="btn btn-fissio-primary" disabled={!formData.NombreCategoria.trim() || nombreYaExiste(formData.NombreCategoria)}>
                <span className="material-symbols-outlined me-1">save</span>{modalMode === 'create' ? 'Crear Categoría' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalCategoria
