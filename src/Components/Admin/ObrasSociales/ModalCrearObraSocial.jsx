import React, { useState } from 'react';
import useCustomObrasSociales from '../../../Custom/ObrasSociales/useCustomObrasSociales';
import { showSuccess, showError, showConfirm } from '../../../Utils/sweetAlerts';

const ModalCrearObraSocial = ({ isOpen, onClose, onCreated }) => {
  const { crearObraSocial } = useCustomObrasSociales();
  const [form, setForm] = useState({
    NombreObraSocial: '',
    TelefonoObra: '',
    EmailObra: '',
    PaginaWebObra: '',
    EstadoObra: 'Activa'
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.NombreObraSocial || form.NombreObraSocial.trim() === '') {
      return showError('Validación', 'El nombre es obligatorio');
    }
    if (!['Activa', 'Suspendida'].includes(form.EstadoObra)) {
      return showError('Validación', "El estado debe ser 'Activa' o 'Suspendida'");
    }

    try {
      const confirmed = await showConfirm('Crear obra social', '¿Deseas crear esta obra social?', 'Crear', 'Cancelar');
      if (!confirmed || !confirmed.isConfirmed) return;
    } catch (err) {
      console.error('confirm error', err);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        NombreObraSocial: form.NombreObraSocial,
        TelefonoObra: form.TelefonoObra || null,
        EmailObra: form.EmailObra || null,
        PaginaWebObra: form.PaginaWebObra || null,
        EstadoObra: form.EstadoObra
      };
      const res = await crearObraSocial(payload);
      if (res?.success === false) throw new Error(res.error || 'Error al crear');
      await showSuccess('Creado', 'Obra social creada correctamente');
      onCreated && onCreated();
      onClose && onClose();
      // reset form
      setForm({ NombreObraSocial: '', TelefonoObra: '', EmailObra: '', PaginaWebObra: '', EstadoObra: 'Activa' });
    } catch (err) {
      console.error(err);
      showError('Error', err.message || 'No se pudo crear la obra social');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal show d-block modal-obras-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-obras-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Crear Obra Social</h5>
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
                {isLoading ? 'Creando...' : 'Crear obra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearObraSocial;
