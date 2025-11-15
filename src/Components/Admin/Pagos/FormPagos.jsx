import React, { useState, useEffect } from 'react';
import useCustomPagos from '../../../Custom/useCustomPagos';
import useCustomCatPagos from '../../../Custom/useCustomCatPagos';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Pagos/FormPagos.css";

const FormPagos = ({ pago, onSuccess, onClose }) => {
  const { crearPago, actualizarPago } = useCustomPagos();
  const { mediosPago, tiposPago } = useCustomCatPagos();

  const [nuevoPago, setNuevoPago] = useState({
    FechaPago: '',
    idTipoPago: '',
    idMedioPago: '',
    MontoPago: '',
    Descripcion: '',
    EstadoPago: 'Pendiente'
  });

  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (pago) {
      setNuevoPago({
        FechaPago: pago.FechaPago.split("T")[0],
        idTipoPago: pago.idTipoPago || '',
        idMedioPago: pago.idMedioPago || '',
        MontoPago: pago.MontoPago || '',
        Descripcion: pago.Descripcion || '',
        EstadoPago: pago.EstadoPago || 'Pagado'
      });
    } else {
      // Al crear un nuevo pago, se asigna automáticamente la fecha actual
      setNuevoPago({
        FechaPago: new Date().toISOString().split("T")[0],
        idTipoPago: '',
        idMedioPago: '',
        MontoPago: '',
        Descripcion: '',
        EstadoPago: 'Pagado'
      });
    }
  }, [pago]);

  const handleChange = (e) => {
    setNuevoPago({ ...nuevoPago, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (procesando) return;

    setProcesando(true);

    try {
      let res;
      if (pago) {
        const result = await Swal.fire({
          title: "¿Editar pago?",
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

        res = await actualizarPago(pago.idPago, nuevoPago);
      } else {
        res = await crearPago(nuevoPago);
      }

      if (res.success) {
        toast.success(pago ? 'Pago editado' : 'Pago agregado');
        onSuccess();
      } else {
        toast.error(res.error || 'Error al guardar');
      }
    } catch (err) {
      toast.error('Error inesperado');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-pagos">
      <div className="mb-3">
        <label className="form-label">Tipo de Pago</label>
        <select
          name="idTipoPago"
          value={nuevoPago.idTipoPago}
          onChange={handleChange}
          className="form-select"
          required
          disabled={procesando}
        >
          <option value="">Seleccionar tipo</option>
          {tiposPago.map(t => (
            <option key={t.idTipoPago} value={t.idTipoPago}>{t.NombreTipo}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Medio de Pago</label>
        <select
          name="idMedioPago"
          value={nuevoPago.idMedioPago}
          onChange={handleChange}
          className="form-select"
          required
          disabled={procesando}
        >
          <option value="">Seleccionar medio</option>
          {mediosPago.map(m => (
            <option key={m.idMedioPago} value={m.idMedioPago}>{m.NombreMedio}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input
          name="MontoPago"
          type="number"
          step="0.01"
          value={nuevoPago.MontoPago}
          onChange={handleChange}
          className="form-control"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          name="Descripcion"
          value={nuevoPago.Descripcion}
          onChange={handleChange}
          className="form-control"
          rows="3"
          disabled={procesando}
        />
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={procesando}
        >
          {procesando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </>
          ) : (
            pago ? 'Guardar Cambios' : 'Agregar Pago'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormPagos;