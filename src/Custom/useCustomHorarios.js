import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';

const useCustomHorarios = () => {
  const [data, setData] = useState({ horarios: [], asignaciones: [], empleados: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [horariosRes, asignacionesRes, empleadosRes] = await Promise.all([
        axios.get(`${BASE_URL}api/horariosTrabajo/v1`),
        axios.get(`${BASE_URL}api/empleadosHorarios/v1`),
        axios.get(`${BASE_URL}api/empleados/v1/activos`)
      ]);

      const empleadosLista = empleadosRes.data.map(e => ({
        idEmpleado: e.idEmpleado,
        NombreCompleto: `${e.NombreEmpleado} ${e.ApellidoEmpleado}`
      }));

      setData({
        horarios: horariosRes.data,
        asignaciones: asignacionesRes.data,
        empleados: empleadosLista
      });
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.response?.data?.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const crearHorario = async (data) => {
    try {
      await axios.post(`${BASE_URL}api/horariosTrabajo/v1`, data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Error al crear" };
    }
  };

  const editarHorario = async (id, data) => {
    try {
      await axios.put(`${BASE_URL}api/horariosTrabajo/v1/${id}`, data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Error al editar" };
    }
  };

  const desactivarHorario = async (id) => {
    try {
      await axios.put(`${BASE_URL}api/horariosTrabajo/v1/desactivar/${id}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Error al desactivar" };
    }
  };

  const reactivarHorario = async (id) => {
    try {
      await axios.put(`${BASE_URL}api/horariosTrabajo/v1/activar/${id}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Error al reactivar" };
    }
  };

  const asignarHorario = async (idEmpleado, idHorario) => {
    try {
      await axios.post(`${BASE_URL}api/empleadosHorarios/v1`, { idEmpleado, idHorario });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Ya asignado o error" };
    }
  };

  const eliminarAsignacion = async (idEmpHor) => {
    try {
      await axios.delete(`${BASE_URL}api/empleadosHorarios/v1/${idEmpHor}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Error al eliminar" };
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return {
    data,
    loading,
    error,
    obtenerDatos,
    crearHorario,
    editarHorario,
    desactivarHorario,
    reactivarHorario,
    asignarHorario,
    eliminarAsignacion
  };
};

export default useCustomHorarios;