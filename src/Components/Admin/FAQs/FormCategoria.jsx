import React, { useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '../../../Api/api';
import "../../../Css/Faqs/FormFaqs.css";

const FormCategoria = ({ onSuccess}) => {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [procesando, setProcesando] = useState(false);

  const handleChange = (e) => {
    setNombreCategoria(e.target.value);
  };

  const validarFormulario = () => {
    if (nombreCategoria.trim().length < 3) {
      toast.error("La categoría debe tener mínimo 3 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setProcesando(true);

    try {
      const result = await Swal.fire({
        title: "¿Crear categoría?",
        text: `Se creará la categoría "${nombreCategoria}"`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, crear",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0470BB",
        cancelButtonColor: "#6c757d",
      });

      if (!result.isConfirmed) {
        setProcesando(false);
        return;
      }

      await axios.post(`${BASE_URL}api/cat-faqs/v1`, { NombreCategoria: nombreCategoria });
      toast.success("Categoría creada correctamente");
      setNombreCategoria('');
      onSuccess();
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      toast.error('Error al crear la categoría');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="form-faqs-container">
      <h4 className="form-title mb-4 text-center">
        Nueva Categoría
      </h4>

      <form onSubmit={handleSubmit} className="form-faqs">
        <div className="mb-3">
          <label className="form-label fw-bold">Nombre de la Categoría</label>
          <input
            type="text"
            value={nombreCategoria}
            onChange={handleChange}
            className={`form-control ${nombreCategoria.trim().length < 3 && nombreCategoria.length > 0 ? 'is-invalid' : ''}`}
            placeholder="Ej: Horarios"
            required
            disabled={procesando}
          />
          <small className={nombreCategoria.trim().length < 3 ? 'text-danger' : 'text-muted'}>
            {nombreCategoria.length}/3 caracteres mínimo
          </small>
        </div>

        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-submit"
            disabled={procesando || nombreCategoria.trim().length < 3}
          >
            {procesando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Guardando...
              </>
            ) : (
              'Crear Categoría'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCategoria;