import axios from 'axios';
import { BASE_URL } from '../../Api/api';
import { useState, useEffect } from 'react';

const useCustomFeedback = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerComentariosActivos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}api/comentarios/v1/`);
      setComentarios(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const crearComentario = async (comentarioData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}api/comentarios/v1/crear`, comentarioData);
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarComentario = async (id, comentarioData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}api/comentarios/v1/actualizar/${id}`, comentarioData);
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarComentario = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}api/comentarios/v1/borrado-logico/${id}`);
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerComentarioPorId = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}api/comentarios/v1/${id}`);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerComentariosPublicados = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/comentarios/v1/publicados`);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const publicarComentario = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}api/comentarios/v1/publicar/${id}`);
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const despublicarComentario = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}api/comentarios/v1/despublicar/${id}`);
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerComentariosActivos();

  }, []);

  return {
    comentarios,
    loading,
    error,
    obtenerComentariosActivos,
    obtenerComentariosPublicados,
    crearComentario,
    actualizarComentario,
    eliminarComentario,
    obtenerComentarioPorId,
    publicarComentario,
    despublicarComentario
  };
};

export default useCustomFeedback;
