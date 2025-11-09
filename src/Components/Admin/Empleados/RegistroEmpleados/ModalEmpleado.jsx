import React from 'react'

const ModalEmpleado = ({ showModal, modalMode, formData, handleInputChange, handleSave, handleCloseModal, dniYaExiste, localidades, categorias }) => {
  if (!showModal) return null
  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><span className="material-symbols-outlined me-2">badge</span>{modalMode === 'create' ? 'Nuevo Empleado' : 'Editar Empleado'}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4 mb-3"><label className="form-label">DNI *</label><input name="DNI" className={`form-control ${formData.DNI && dniYaExiste(formData.DNI) ? 'is-invalid' : ''}`} value={formData.DNI} onChange={handleInputChange} required /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Nombre *</label><input name="NombreEmpleado" className="form-control" value={formData.NombreEmpleado} onChange={handleInputChange} required /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Apellido *</label><input name="ApellidoEmpleado" className="form-control" value={formData.ApellidoEmpleado} onChange={handleInputChange} required /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Fecha Nac. *</label><input type="date" name="FechaNacEmpleado" className="form-control" value={formData.FechaNacEmpleado} onChange={handleInputChange} required /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Teléfono</label><input name="TelefonoEmpleado" className="form-control" value={formData.TelefonoEmpleado} onChange={handleInputChange} /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Dirección</label><input name="DireccionEmpleado" className="form-control" value={formData.DireccionEmpleado} onChange={handleInputChange} /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Localidad</label>
                  <select name="idLocalidad" className="form-select" value={formData.idLocalidad} onChange={handleInputChange}><option value="">Seleccionar</option>{localidades.map(loc => <option key={loc.idLocalidad ?? loc.id} value={loc.idLocalidad ?? loc.id}>{loc.NombreLocalidad ?? loc.nombre}</option>)}</select>
                </div>
                <div className="col-md-4 mb-3"><label className="form-label">Categoría *</label>
                  <select name="idCatEmpleado" className="form-select" value={formData.idCatEmpleado} onChange={handleInputChange} required><option value="">Seleccionar</option>{(categorias||[]).map(cat => <option key={cat.idCatEmpleado ?? cat.id} value={cat.idCatEmpleado ?? cat.id}>{cat.NombreCat || cat.NombreCategoria}</option>)}</select>
                </div>
                <div className="col-md-4 mb-3"><label className="form-label">Salario *</label><input type="number" step="0.01" name="SalarioEmpleado" className="form-control" value={formData.SalarioEmpleado} onChange={handleInputChange} required /></div>
                <div className="col-md-4 mb-3"><label className="form-label">Mail (opcional)</label><input name="MailUsuario" className="form-control" value={formData.MailUsuario} onChange={handleInputChange} /></div>
                {modalMode === 'create' && (<div className="col-md-4 mb-3"><label className="form-label">Password (si crea usuario)</label><input type="password" name="PasswordUsuario" className="form-control" value={formData.PasswordUsuario} onChange={handleInputChange} /></div>)}
              </div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button><button type="submit" className="btn btn-fissio-primary" disabled={!formData.DNI.trim() || !formData.NombreEmpleado.trim() || !formData.ApellidoEmpleado.trim() || !formData.SalarioEmpleado || !formData.idCatEmpleado || (formData.DNI && dniYaExiste(formData.DNI))}><span className="material-symbols-outlined me-1">save</span>{modalMode === 'create' ? 'Crear Empleado' : 'Guardar cambios'}</button></div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalEmpleado
