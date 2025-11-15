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
        axios.get(`${BASE_URL}api/faqs/v1`),
        axios.get(`${BASE_URL}api/cat-faqs/v1`)
      ]);
      setFaqs({ faqs: faqsRes.data, categorias: catsRes.data });
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.response?.data?.message || "Error de conexión");
      setFaqs({ faqs: [], categorias: [] });
    } finally {
      setLoading(false);
    }
  };

  const agregarFaq = async (data) => {
    try {
      console.log('Datos enviados a agregarFaq:', data);
      const res = await axios.post(`${BASE_URL}api/faqs/v1/`, data);
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error('Error completo al agregar FAQ:', err.response?.data);
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

  const eliminarFaq = async (id) => {
    try {
      await axios.put(`${BASE_URL}api/faqs/v1/cambiarEstado/${id}`, { IsActive: 0 });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Error al desactivar" };
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

  const desactivarCategoria = async (id) => {
    try {
      await axios.put(`${BASE_URL}api/cat-faqs/v1/${id}`, { IsActive: 0 });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Error al desactivar" };
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