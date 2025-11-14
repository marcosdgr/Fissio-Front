import React, { useState, useEffect } from 'react';
import useCustomTratamientos from '../../../Custom/useCustomTratamientos';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Tratamientos/FormTratamientos.css";

const FormTratamientos = ({ tratamiento, onSuccess }) => {
  const { agregarTratamiento, editarTratamiento } = useCustomTratamientos();

  const [nuevoTratamiento, setNuevoTratamiento] = useState({
    NombreTratamiento: '',
    DescripcionTratamiento: '',
    DuracionTratamiento: '',
    InformeTratamiento: ''
  });

  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (tratamiento) {
      setNuevoTratamiento({
        NombreTratamiento: tratamiento.NombreTratamiento || '',
        DescripcionTratamiento: tratamiento.DescripcionTratamiento || '',
        DuracionTratamiento: tratamiento.DuracionTratamiento || '',
        InformeTratamiento: tratamiento.InformeTratamiento || ''
      });
    } else {
      setNuevoTratamiento({
        NombreTratamiento: '',
        DescripcionTratamiento: '',
        DuracionTratamiento: '',
        InformeTratamiento: ''
      });
    }
  }, [tratamiento]);

  const handleChange = (e) => {
    setNuevoTratamiento({ ...nuevoTratamiento, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault(); 
  if (procesando) return;

  setProcesando(true);

  try {
    let res;

    if (tratamiento) {
      // === EDITAR (con confirmación) ===
      const result = await Swal.fire({
        title: "¿Editar tratamiento?",
        text: `Se actualizarán los datos de "${nuevoTratamiento.NombreTratamiento}"`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ffc107",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        setProcesando(false);
        return;
      }

      res = await editarTratamiento(tratamiento.idTratamiento, nuevoTratamiento);
    } else {
      // === CREAR NUEVO (CON CONFIRMACIÓN ÉPICA) ===
      const result = await Swal.fire({
        title: "¿Crear nuevo tratamiento?",
        html: `
          <p><strong>Nombre:</strong> ${nuevoTratamiento.NombreTratamiento}</p>
          <p><strong>Duración:</strong> ${nuevoTratamiento.DuracionTratamiento} min</p>
          <p>¿Estás seguro de crear este tratamiento?</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Sí, crear",
        cancelButtonText: "Cancelar",
        width: "500px"
      });

      if (!result.isConfirmed) {
        toast.info("Creación cancelada");
        setProcesando(false);
        return;
      }

      res = await agregarTratamiento(nuevoTratamiento);
    }

    // === ÉXITO ===
    if (res.success) {
      toast.success(tratamiento ? 'Tratamiento editado' : 'Tratamiento creado con éxito');
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
    <form onSubmit={handleSubmit} className="form-tratamientos">
      <div className="mb-3">
        <label className="form-label">Nombre del Tratamiento</label>
        <input
          name="NombreTratamiento"
          value={nuevoTratamiento.NombreTratamiento}
          onChange={handleChange}
          className="form-control"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          name="DescripcionTratamiento"
          value={nuevoTratamiento.DescripcionTratamiento}
          onChange={handleChange}
          className="form-control"
          rows="4"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Duración (minutos)</label>
        <input
          name="DuracionTratamiento"
          value={nuevoTratamiento.DuracionTratamiento}
          onChange={handleChange}
          type="number"
          min="1"
          className="form-control"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Informe (opcional)</label>
        <textarea
          name="InformeTratamiento"
          value={nuevoTratamiento.InformeTratamiento}
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
            tratamiento ? 'Guardar Cambios' : 'Agregar Tratamiento'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormTratamientos;