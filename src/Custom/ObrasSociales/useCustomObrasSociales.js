import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../Api/api';

// Hook que centraliza la lógica de obtener la lista de obras sociales desde el backend.
const useCustomObrasSociales = () => {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todas las obras sociales
  const obtenerTodasLasObrasSociales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}api/obras-sociales/v1/`);
      setObrasSociales(response.data || []);
    } catch (err) {
      setError(err);
      console.error('error al obtener las obras sociales', err);
      setObrasSociales([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una obra social por su id
  const obtenerObraSocialPorId = async (idObraSocial) => {
    try {
      const response = await axios.get(`${BASE_URL}api/obras-sociales/v1/${idObraSocial}`);
      return response.data;
    } catch (err) {
      console.error('error al obtener la obra social por id', err);
      throw err;
    }
  };

  // Crear una nueva obra social y actualizar el listado
  const crearObraSocial = async (nuevaObraSocial) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${BASE_URL}api/obras-sociales/v1/crearObraSocial`, nuevaObraSocial);
      // Actualiza la lista después de crear una nueva obra social
      if (response?.data) {
        setObrasSociales((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No se recibió respuesta del servidor' };
    } catch (err) {
      setError(err.message || err);
      return { success: false, error: err.response?.data?.message || err.message || err };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una obra social existente
  const actualizarObraSocial = async (idObraSocial, datosActualizados) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${BASE_URL}api/obras-sociales/v1/actualizarObraSocial/${idObraSocial}`, datosActualizados);
      if (response?.data) {
        setObrasSociales((prev) => prev.map((obra) => (obra.id === idObraSocial ? response.data : obra)));
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No se recibió respuesta del servidor' };
    } catch (err) {
      setError(err.message || err);
      return { success: false, error: err.response?.data?.message || err.message || err };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado (activar/desactivar) una obra social
  const borradoLogicoObraSocial = async (idObraSocial) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${BASE_URL}api/obras-sociales/v1/cambiarEstadoObra/${idObraSocial}`);
      if (response?.data) {
        setObrasSociales((prev) => prev.map((obra) => (obra.id === idObraSocial ? response.data : obra)));
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No se recibió respuesta del servidor' };
    } catch (err) {
      setError(err.message || err);
      return { success: false, error: err.response?.data?.message || err.message || err };
    } finally {
      setLoading(false);
    }
  };

  // Obtener solo activas
  const obtenerObrasSocialesActivas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}api/obras-sociales/v1/activos`);
      setObrasSociales(response.data || []);
    } catch (err) {
      setError(err);
      console.error('error al obtener las obras sociales activas', err);
      setObrasSociales([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener solo inactivas
  const obtenerObrasSocialesInactivas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}api/obras-sociales/v1/inactivos`);
      setObrasSociales(response.data || []);
    } catch (err) {
      setError(err);
      console.error('error al obtener las obras sociales inactivas', err);
      setObrasSociales([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todas las obras sociales al montar el hook
  useEffect(() => {
    obtenerTodasLasObrasSociales();
  }, []);

  // API pública del hook
  return {
    obrasSociales,
    loading,
    error,
    obtenerTodasLasObrasSociales,
    obtenerObraSocialPorId,
    crearObraSocial,
    actualizarObraSocial,
    borradoLogicoObraSocial, //CAMBIAR EL ESTADO DE ACTIVO A INACTIVO O VICEVERSA
    obtenerObrasSocialesActivas,
    obtenerObrasSocialesInactivas,
  };
};

export default useCustomObrasSociales;
