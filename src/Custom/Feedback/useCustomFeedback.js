import axios from 'axios';
import { BASE_URL } from '../../Api/api';
import { useState, useEffect } from 'react';

const useCustomFeedback = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los comentarios activos
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

  // Crear comentario
  const crearComentario = async (comentarioData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}api/comentarios/v1/`, comentarioData);
      // Recargar la lista completa después de crear
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar comentario
  const actualizarComentario = async (id, comentarioData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}api/comentarios/v1/${id}`, comentarioData);
      // Recargar la lista completa después de actualizar
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar comentario (borrado lógico)
  const eliminarComentario = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}api/comentarios/v1/${id}`);
      // Recargar la lista completa después de eliminar
      await obtenerComentariosActivos();
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener comentario por ID
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

  // Cargar comentarios al montar el componente
  useEffect(() => {
    obtenerComentariosActivos();

  }, []);

  return {
    comentarios,
    loading,
    error,
    obtenerComentariosActivos,
    crearComentario,
    actualizarComentario,
    eliminarComentario,
    obtenerComentarioPorId
  };
};

export default useCustomFeedback;
