import React, { useState, useEffect } from 'react';
import useCustomFaqs from '../../../Custom/useCustomFaqs';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import "../../../Css/Faqs/FormFaqs.css";

const FormFaqs = ({ faq, categorias, onSuccess, onClose }) => {
  const { agregarFaq, editarFaq } = useCustomFaqs();

  const [nuevaFaq, setNuevaFaq] = useState({
    Pregunta: '',
    Respuesta: '',
    idCatFAQ: ''
  });

  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (faq) {
      setNuevaFaq({
        Pregunta: faq.Pregunta || '',
        Respuesta: faq.Respuesta || '',
        idCatFAQ: faq.idCatFAQ || ''
      });
    } else {
      setNuevaFaq({ Pregunta: '', Respuesta: '', idCatFAQ: '' });
    }
  }, [faq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaFaq({ ...nuevaFaq, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);

    try {
      if (faq) {
        const result = await Swal.fire({
          title: "¿Editar FAQ?",
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

        const res = await editarFaq(faq.idFAQ, nuevaFaq);
        if (res.success) {
          toast.success('FAQ editada correctamente');
          onSuccess();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await agregarFaq(nuevaFaq);
        if (res.success) {
          toast.success('FAQ agregada correctamente');
          onSuccess();
        } else {
          toast.error(res.error);
        }
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      toast.error('Error inesperado');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="form-faqs-container">
      {/* TÍTULO */}
      <h4 className="form-title mb-4 text-center">
        {faq ? 'Editar FAQ' : 'Nueva FAQ'}
      </h4>

      <form onSubmit={handleSubmit} className="form-faqs">
        <div className="mb-3">
          <label className="form-label fw-bold">Pregunta</label>
          <input
            name="Pregunta"
            value={nuevaFaq.Pregunta}
            onChange={handleChange}
            className="form-control"
            placeholder="Ej: ¿Cuánto dura una sesión?"
            required
            disabled={procesando}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Respuesta</label>
          <textarea
            name="Respuesta"
            value={nuevaFaq.Respuesta}
            onChange={handleChange}
            className="form-control"
            rows="6"
            placeholder="Escribe una respuesta clara y completa..."
            required
            disabled={procesando}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Categoría</label>
          <select
            name="idCatFAQ"
            value={nuevaFaq.idCatFAQ}
            onChange={handleChange}
            className="form-select"
            required
            disabled={procesando || categorias.length === 0}
          >
            <option value="">
              {categorias.length === 0 ? 'No hay categorías' : 'Seleccione una categoría'}
            </option>
            {categorias.map(cat => (
              <option key={cat.idCatFAQ} value={cat.idCatFAQ}>
                {cat.NombreCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-submit"
            disabled={procesando || categorias.length === 0}
          >
            {procesando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Guardando...
              </>
            ) : (
              faq ? 'Guardar Cambios' : 'Agregar FAQ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFaqs;