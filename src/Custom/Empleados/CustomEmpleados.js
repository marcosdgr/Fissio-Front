import axios from 'axios'
import { BASE_URL } from '../../Api/api'
import { useEffect, useState } from 'react'

const useCustomEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const obtenerTodosLosEmpleados = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}api/empleados/v1/`);
        setEmpleados(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const crearEmpleado = async (nuevoEmpleado) => {
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}api/empleados/v1/crearEmpleado`, nuevoEmpleado);
        await obtenerTodosLosEmpleados();
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    const editarEmpleado = async (idEmpleado, datosActualizados) => {
      try {
        setLoading(true);
        const response = await axios.put(`${BASE_URL}api/empleados/v1/actualizarEmpleado/${idEmpleado}`, datosActualizados);
        await obtenerTodosLosEmpleados();
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

const cambiarEstadoEmpleado = async (idEmpleado, nuevoEstado) => {
      try {
        setLoading(true);
        const response = await axios.put(`${BASE_URL}api/empleados/v1/cambiarestado/${idEmpleado}`, { IsActive: nuevoEstado });
        await obtenerTodosLosEmpleados();
        return response.data;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      obtenerTodosLosEmpleados();
    }, []);

  return {
    empleados,
    loading,
    error,
    obtenerTodosLosEmpleados,
    crearEmpleado,
    editarEmpleado,
    cambiarEstadoEmpleado
 };
};



export const obtenerEmpleadoPorId = async (idEmpleado) => {
  try {
    const response = await axios.get(`${BASE_URL}api/empleados/v1/${idEmpleado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    throw error;
  }
};

export const actualizarEmpleado = async (idEmpleado, datosActualizados) => {
  try {
    const response = await axios.put(`${BASE_URL}api/empleados/v1/actualizarEmpleado/${idEmpleado}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    throw error;
  }
};
export default useCustomEmpleados;