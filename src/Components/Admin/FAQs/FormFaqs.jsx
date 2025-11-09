import React, { useState, useEffect } from 'react';
import useCustomFaqs from '../../../Custom/useCustomFaqs';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '../../../Api/api';
import "../../../Css/Faqs/FormFaqs.css";


const FormFaqs = ({ faq, categorias, onSuccess }) => {
  const { agregarFaq, editarFaq } = useCustomFaqs();

  const [nuevaFaq, setNuevaFaq] = useState({
    Pregunta: '',
    Respuesta: '',
    idCatFAQ: ''
  });

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);
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

  const crearCategoriaDesdeModal = async () => {
    if (!nuevaCategoria.trim()) return;

    try {
      const res = await axios.post(`${BASE_URL}api/cat-faqs/v1`, { NombreCategoria: nuevaCategoria });
      toast.success('Categoría creada');
      setNuevaCategoria('');
      setMostrarInputCategoria(false);
      onSuccess();
      setNuevaFaq(prev => ({ ...prev, idCatFAQ: res.data.data.idCatFAQ }));
    } catch (err) {
      toast.error('Error al crear categoría');
    }
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
      toast.error('Error inesperado');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-faqs">
      <div className="mb-3">
        <label className="form-label">Pregunta</label>
        <input
          name="Pregunta"
          value={nuevaFaq.Pregunta}
          onChange={handleChange}
          className="form-control"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Respuesta</label>
        <textarea
          name="Respuesta"
          value={nuevaFaq.Respuesta}
          onChange={handleChange}
          className="form-control"
          rows="5"
          required
          disabled={procesando}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
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

        {categorias.length === 0 || mostrarInputCategoria ? (
          <div className="mt-2">
            {mostrarInputCategoria ? (
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de la categoría"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && crearCategoriaDesdeModal()}
                />
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={crearCategoriaDesdeModal}
                >
                  Crear
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setMostrarInputCategoria(false);
                    setNuevaCategoria('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-link p-0 mt-1"
                onClick={() => setMostrarInputCategoria(true)}
              >
                + Crear nueva categoría
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-link p-0 mt-1"
            onClick={() => setMostrarInputCategoria(true)}
          >
            + Crear nueva categoría
          </button>
        )}
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary btn-submit" disabled={procesando || categorias.length === 0}>
          {procesando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Procesando...
            </>
          ) : (
            faq ? 'Guardar Cambios' : 'Agregar FAQ'
          )}
        </button>
      </div>
    </form>
  );
};

export default FormFaqs;