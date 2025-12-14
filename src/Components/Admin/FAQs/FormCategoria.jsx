import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import useCustomFaqs from '../../../Custom/useCustomFaqs';
import { showSuccess } from '../../../Utils/sweetAlerts';
import "../../../Css/Faqs/FormFaqs.css";

const FormCategoria = ({ categoria, onSuccess }) => {
  const { crearCategoria, editarCategoria } = useCustomFaqs();
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (categoria) {
      setNombreCategoria(categoria.NombreCategoria || '');
    } else {
      setNombreCategoria('');
    }
  }, [categoria]);

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
      const accion = categoria ? "actualizar" : "crear";
      const result = await Swal.fire({
        title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} categoría?`,
        text: `Se ${accion}á la categoría "${nombreCategoria}"`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Sí, ${accion}`,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0470BB",
        cancelButtonColor: "#6c757d",
      });

      if (!result.isConfirmed) {
        setProcesando(false);
        return;
      }

      if (categoria) {
        // Editar categoría existente
        const res = await editarCategoria(categoria.idCatFAQ, { NombreCategoria: nombreCategoria });
        if (!res.success) {
          toast.error(res.error || 'Error al actualizar la categoría');
          setProcesando(false);
          return;
        }
        await showSuccess('¡Categoría actualizada!', `La categoría ha sido actualizada correctamente`);
      } else {
        // Crear nueva categoría
        const res = await crearCategoria({ NombreCategoria: nombreCategoria });
        if (!res.success) {
          toast.error(res.error || 'Error al crear la categoría');
          setProcesando(false);
          return;
        }
        await showSuccess('¡Categoría creada!', `La categoría "${nombreCategoria}" ha sido agregada correctamente`);
      }
      
      setNombreCategoria('');
      onSuccess();
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      toast.error(`Error al ${categoria ? 'actualizar' : 'crear'} la categoría`);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="form-faqs-container">
      <h4 className="form-title mb-4 text-center">
        {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
                {categoria ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              `${categoria ? 'Actualizar' : 'Crear'} Categoría`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCategoria;