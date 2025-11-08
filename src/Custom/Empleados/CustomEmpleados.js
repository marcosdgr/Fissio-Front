import axios from 'axios'
import { BASE_URL } from '../../Api/api'
import { useEffect, useState } from 'react'

const useCustomEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Obtener todos los empleados
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
        const response = await axios.post(`${BASE_URL}api/empleados/v1/crearEmpleado/`, nuevoEmpleado);
        setEmpleados((prevEmpleados) => [...prevEmpleados, response.data]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const editarEmpleado = async (idEmpleado, datosActualizados) => {
      try {
        setLoading(true);
        const response = await axios.put(`${BASE_URL}api/empleados/v1/actualizarEmpleado/${idEmpleado}/`, datosActualizados);
        setEmpleados((prevEmpleados) =>
          prevEmpleados.map((empleado) => (empleado.id === idEmpleado ? response.data : empleado))
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

const cambiarEstadoEmpleado = async (idEmpleado) => {
      try {
        setLoading(true);
        const response = await axios.put(`${BASE_URL}api/empleados/v1/cambiarEstado/${idEmpleado}/`);
        setEmpleados((prevEmpleados) =>
          prevEmpleados.map((empleado) => (empleado.id === idEmpleado ? response.data : empleado))
        );
      } catch (error) {
        setError(error);
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

export default useCustomEmpleados;
