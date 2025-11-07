import React, { useEffect, useState } from 'react';
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales';
import { showSuccess, showError, showConfirm } from '../../../Utils/sweetAlerts';

const ModalEditarObra = ({ isOpen, obra, onClose, onSaved }) => {
  const { actualizarObraSocial } = useCustomObrasSociales();
  const [form, setForm] = useState({
    NombreObraSocial: '',
    TelefonoObra: '',
    EmailObra: '',
    PaginaWebObra: '',
    EstadoObra: 'Activa'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && obra) {
      setForm({
        NombreObraSocial: obra.NombreObraSocial ?? obra.Nombre ?? obra.nombre ?? '',
        TelefonoObra: obra.TelefonoObra ?? obra.TelefonoObraSocial ?? obra.telefono ?? '',
        EmailObra: obra.EmailObra ?? obra.EmailObraSocial ?? obra.email ?? '',
        PaginaWebObra: obra.PaginaWebObra ?? obra.PaginaWeb ?? obra.pagina ?? '',
        EstadoObra: obra.EstadoObra ?? obra.estado ?? (obra.IsActive ? 'Activa' : 'Suspendida')
      });
    }
  }, [isOpen, obra]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // simple validation
    if (!form.NombreObraSocial || form.NombreObraSocial.trim() === '') {
      return showError('Validación', 'El nombre es obligatorio');
    }
    if (!['Activa', 'Suspendida'].includes(form.EstadoObra)) {
      return showError('Validación', "El estado debe ser 'Activa' o 'Suspendida'");
    }

    // confirm before saving
    try {
      const confirmed = await showConfirm('Guardar cambios', '¿Deseas guardar los cambios realizados?', 'Guardar', 'Cancelar');
      if (!confirmed || !confirmed.isConfirmed) {
        return; // user cancelled
      }
    } catch (err) {
      // if confirm fails for any reason, don't proceed
      console.error('confirm error', err);
      return;
    }

    setIsLoading(true);
    try {
      const id = obra.idObraSocial ?? obra.id ?? obra.id_obrasocial;
      const payload = {
        NombreObraSocial: form.NombreObraSocial,
        TelefonoObra: form.TelefonoObra || null,
        EmailObra: form.EmailObra || null,
        PaginaWebObra: form.PaginaWebObra || null,
        EstadoObra: form.EstadoObra
      };
      const res = await actualizarObraSocial(id, payload);
      if (res?.success === false) throw new Error(res.error || 'Error al actualizar');
      await showSuccess('Guardado', 'Obra social actualizada correctamente');
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      showError('Error', err.message || 'No se pudo actualizar la obra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal show d-block modal-obras-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-obras-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Obra Social</h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => onClose && onClose()}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input name="NombreObraSocial" value={form.NombreObraSocial} onChange={handleChange} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select name="EstadoObra" value={form.EstadoObra} onChange={handleChange} className="form-select">
                      <option value="Activa">Activa</option>
                      <option value="Suspendida">Suspendida</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input name="TelefonoObra" value={form.TelefonoObra} onChange={handleChange} className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="EmailObra" value={form.EmailObra} onChange={handleChange} type="email" className="form-control" />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Página web</label>
                <input name="PaginaWebObra" value={form.PaginaWebObra} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => onClose && onClose()} disabled={isLoading}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarObra;
