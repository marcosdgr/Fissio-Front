import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';

const useCustomFaqs = () => {
  const [faqs, setFaqs] = useState({ faqs: [], categorias: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [faqsRes, catsRes] = await Promise.all([
        axios.get(`${BASE_URL}api/faqs/v1?includeInactive=true`),
        axios.get(`${BASE_URL}api/cat-faqs/v1?includeInactive=true`)
      ]);
      setFaqs({ faqs: faqsRes.data, categorias: catsRes.data });
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.response?.data?.message || "Error de conexiÃ³n");
      setFaqs({ faqs: [], categorias: [] });
    } finally {
      setLoading(false);
    }
  };

  const agregarFaq = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}api/faqs/v1/`, data);
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error('Error al agregar FAQ:', err);
      return { success: false, error: err.response?.data?.errores?.[0]?.msg || err.response?.data?.message || "Error al agregar" };
    }
  };

  const editarFaq = async (id, data) => {
    try {
      const res = await axios.put(`${BASE_URL}api/faqs/v1/${id}`, data);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.errores?.[0]?.msg || "Error al editar" };
    }
  };

  const eliminarFaq = async (id, isActive = 0) => {
    try {
      await axios.put(`${BASE_URL}api/faqs/v1/cambiarEstado/${id}`, { IsActive: isActive });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Error al cambiar estado" };
    }
  };

  const editarCategoria = async (id, data) => {
    try {
      const res = await axios.put(`${BASE_URL}api/cat-faqs/v1/${id}`, data);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.errores?.[0]?.msg || "Error al editar" };
    }
  };

  const desactivarCategoria = async (id, isActive = 0) => {
    try {
      await axios.put(`${BASE_URL}api/cat-faqs/v1/${id}`, { IsActive: isActive });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Error al cambiar estado" };
    }
  };

  useEffect(() => {
    obtenerFaqs();
  }, []);

  return {
    faqs,
    loading,
    error,
    obtenerFaqs,
    agregarFaq,
    editarFaq,
    eliminarFaq,
    editarCategoria,
    desactivarCategoria
  };
};

export default useCustomFaqs;