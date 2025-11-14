// src/Components/Admin/MetricasDiarias/FormMetricasDiarias.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const FormMetricasDiarias = ({ agregarMetrica, onSuccess, onClose }) => {
  const [procesando, setProcesando] = useState(false);

  const [form, setForm] = useState({
    FechaBalance: new Date().toISOString().split('T')[0],
    IngresosCobrados: 0,
    IngresosPendientes: 0,
    EgresosPagados: 0,
    EgresosPendientes: 0,
    TurnosProgramados: 0,
    TurnosAtendidos: 0,
    TurnosCancelados: 0,
    idTurno: null,
    idPago: null,
    idCobro: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← NECESARIO
    if (procesando || !agregarMetrica) return;

    const result = await Swal.fire({
      title: '¿Crear métrica diaria?',
      text: `Fecha: ${form.FechaBalance}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setProcesando(true);
    try {
      const res = await agregarMetrica(form);
      if (res.success) {
        toast.success('Métrica creada');
        onSuccess(); // ← Recarga lista
      } else {
        toast.error(res.error || 'Error al crear');
      }
    } catch (err) {
      toast.error('Error inesperado');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-metricas"> {/* ← AQUÍ ESTÁ EL ERROR */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          <input 
            type="date" 
            name="FechaBalance" 
            value={form.FechaBalance} 
            onChange={handleChange} 
            className="form-control" 
            required 
            disabled={procesando} 
          />
        </div>

        <div className="col-12"><h6 className="mt-3 mb-2 text-primary">Ingresos</h6></div>
        <div className="col-md-6">
          <label className="form-label">Cobrados</label>
          <input type="number" name="IngresosCobrados" value={form.IngresosCobrados} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Pendientes</label>
          <input type="number" name="IngresosPendientes" value={form.IngresosPendientes} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>

        <div className="col-12"><h6 className="mt-3 mb-2 text-danger">Egresos</h6></div>
        <div className="col-md-6">
          <label className="form-label">Pagados</label>
          <input type="number" name="EgresosPagados" value={form.EgresosPagados} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Pendientes</label>
          <input type="number" name="EgresosPendientes" value={form.EgresosPendientes} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>

        <div className="col-12"><h6 className="mt-3 mb-2 text-info">Turnos</h6></div>
        <div className="col-md-4">
          <label className="form-label">Programados</label>
          <input type="number" name="TurnosProgramados" value={form.TurnosProgramados} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Atendidos</label>
          <input type="number" name="TurnosAtendidos" value={form.TurnosAtendidos} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Cancelados</label>
          <input type="number" name="TurnosCancelados" value={form.TurnosCancelados} onChange={handleChange} className="form-control" min="0" disabled={procesando} />
        </div>

        <div className="col-12 mt-4">
          <button 
            type="submit" 
            className="btn btn-primary w-100 btn-submit" 
            disabled={procesando || !agregarMetrica}
          >
            {procesando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : (
              'Crear Métrica Diaria'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormMetricasDiarias;