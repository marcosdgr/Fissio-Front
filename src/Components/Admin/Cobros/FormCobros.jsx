import React, { useState, useEffect } from 'react';
import useCustomCobros from '../../../Custom/useCustomCobros';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Cobros/FormCobros.css";

const FormCobros = ({ cobro, onSuccess }) => {
  const { agregarCobro, editarCobro } = useCustomCobros();

  const [nuevoCobro, setNuevoCobro] = useState({
    FechaCobro: '',
    idTurno: '',
    TipoCobro: 'Paciente',
    idMedioPago: '',
    MontoCobro: '',
    EstadoCobro: 'Cobrado',
    Descripcion: ''
  });

  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (cobro) {
      setNuevoCobro({
        FechaCobro: cobro.FechaCobro.split('T')[0],
        idTurno: cobro.idTurno,
        TipoCobro: cobro.TipoCobro,
        idMedioPago: cobro.idMedioPago,
        MontoCobro: cobro.MontoCobro,
        EstadoCobro: cobro.EstadoCobro,
        Descripcion: cobro.Descripcion || ''
      });
    } else {
      setNuevoCobro({
        FechaCobro: new Date().toISOString().split('T')[0],
        idTurno: '',
        TipoCobro: 'Paciente',
        idMedioPago: '',
        MontoCobro: '',
        EstadoCobro: 'Cobrado',
        Descripcion: ''
      });
    }
  }, [cobro]);

  const handleChange = (e) => {
    setNuevoCobro({ ...nuevoCobro, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (procesando) return;

    setProcesando(true);

    try {
      let res;
      if (cobro) {
        const result = await Swal.fire({
          title: "¿Editar cobro?",
          text: "Se actualizarán los datos",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, actualizar",
          cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) {
          setProcesando(false);
          return;
        }

        res = await editarCobro(cobro.idCobro, nuevoCobro);
      } else {
        res = await agregarCobro(nuevoCobro);
      }

      if (res.success) {
        toast.success(cobro ? 'Cobro editado' : 'Cobro agregado');
        onSuccess();
      } else {
        toast.error(res.error || 'Error al guardar');
      }
    } catch (err) {
      toast.error('Error inesperado');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-cobros">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha</label>
          <input name="FechaCobro" type="date" value={nuevoCobro.FechaCobro} onChange={handleChange} className="form-control" required disabled={procesando} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Turno ID</label>
          <input name="idTurno" type="number" value={nuevoCobro.idTurno} onChange={handleChange} className="form-control" placeholder="Ej: 123" required disabled={procesando} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo</label>
          <select name="TipoCobro" value={nuevoCobro.TipoCobro} onChange={handleChange} className="form-select" required disabled={procesando}>
            <option value="Paciente">Paciente</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Medio de Pago ID</label>
          <input name="idMedioPago" type="number" value={nuevoCobro.idMedioPago} onChange={handleChange} className="form-control" placeholder="Ej: 1" required disabled={procesando} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Monto</label>
          <input name="MontoCobro" type="number" step="0.01" value={nuevoCobro.MontoCobro} onChange={handleChange} className="form-control" required disabled={procesando} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Estado</label>
          <select name="EstadoCobro" value={nuevoCobro.EstadoCobro} onChange={handleChange} className="form-select" required disabled={procesando}>
            <option value="Cobrado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción (opcional)</label>
        <textarea name="Descripcion" value={nuevoCobro.Descripcion} onChange={handleChange} className="form-control" rows="3" disabled={procesando} />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary btn-submit" disabled={procesando}>
          {procesando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </>
          ) : (
            cobro ? 'Guardar Cambios' : 'Registrar Cobro'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormCobros;