import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../Api/api";

// Hook que centraliza la lógica de obtener la lista de planes desde el backend.
// Todas las funciones (obtener todos, obtener por id, crear) están dentro del hook.
const useCustomPlanesObra = (idObraSocial) => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtiene todos los planes y actualiza el estado local
  const obtenerTodosLosPlanes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}plan-obra/v1/`
      );
      setPlanes(response.data || []);
    } catch (err) {
      setError(err);
      console.error("error al obtener los planes de obra social", err);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtiene un plan por su id
  const obtenerPlanesPorId = async (idPlanObra) => {
    try {
      const response = await axios.get(
        `${BASE_URL}plan-obra/v1/obtenerPlanPorId/${idPlanObra}`
      );
      return response.data;
    } catch (error) {
      console.error("error al obtener el plan de obra social por id", error);
      throw error;
    }
  };

  // Crea un nuevo plan y lo agrega al estado local si es exitoso
  const crearPlanObra = async (nuevoPlan) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${BASE_URL}plan-obra/v1/crearPlanObra`,
        nuevoPlan
      );
      if (response?.data) {
        setPlanes((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }
      return { success: false, error: "No se recibió respuesta del servidor" };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
    finally {
      setLoading(false);
    }
  };

  const actualizarPlanObra = async (idPlanObra, datosActualizados) => {
    try {
      const response = await axios.put(
        `${BASE_URL}plan-obra/v1/actualizarPlanObra/${idPlanObra}`,
        datosActualizados
      );
      return response.data;
    } catch (err) {
      console.error("Error al actualizar el plan de obra:", err);
      throw err;
    }
  };

  const cambiarEstadoPlanObra = async (idPlanObra) => {
    try {
      await axios.put(`${BASE_URL}plan-obra/v1/cambiarestado/${idPlanObra}`);
    } catch (err) {
      console.error("Error al cambiar estado del plan de obra:", err);
    }
    finally {
      setLoading(false);
    }
  };

  // traer planes activos

  const obtenerPlanesActivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}plan-obra/v1/Activos`
      );
      setPlanes(response.data || []);
    } catch (error) {
      setError(error);
      console.error("error al obtener los planes de obra social", error);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  };

  const obetenerPlanesInactivos = async () => {
    try {
      setLoading(true);
        setError(null);
      const response = await axios.get(
        `${BASE_URL}plan-obra/v1/inactivos`
      );
      setPlanes(response.data || []);
    } catch (error) {
      setError(error);
      console.error("error al obtener los planes de obra social", error);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  };

  // Ejecuta la carga inicial y cuando cambie idObraSocial
  useEffect(() => {
    obtenerTodosLosPlanes();
  }, [idObraSocial]);

  return {
    planes,
    loading,
    error,
    obtenerTodosLosPlanes,
    obtenerPlanesPorId,
    crearPlanObra,
    cambiarEstadoPlanObra,
    actualizarPlanObra,
    obtenerPlanesActivos,
    obetenerPlanesInactivos
  };
};

export default useCustomPlanesObra;
