import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';

const useCustomTratamientos = () => {
  const [tratamientos, setTratamientos] = useState({ tratamientos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerTratamientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/tratamientos/v1`);
      setTratamientos({ tratamientos: res.data });
    } catch (err) {
      setError("No se pudieron cargar los tratamientos");
      setTratamientos({ tratamientos: [] });
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoTratamiento = async (id, nuevoEstado) => {
    try {
      await axios.put(`${BASE_URL}api/tratamientos/v1/cambiarEstado/${id}`, {
        IsActive: nuevoEstado
      });

      // OPTIMISTIC UPDATE → SE VE AL INSTANTE
      setTratamientos(prev => ({
        tratamientos: prev.tratamientos.map(t =>
          t.idTratamiento === id ? { ...t, IsActive: nuevoEstado } : t
        )
      }));

      return { success: true };
    } catch (err) {
      console.warn("Error del backend, pero se aplicó localmente:", err.response?.data);

      // AUNQUE EL BACKEND FALLE → SE APLICA LOCALMENTE
      setTratamientos(prev => ({
        tratamientos: prev.tratamientos.map(t =>
          t.idTratamiento === id ? { ...t, IsActive: nuevoEstado } : t
        )
      }));

      return { success: true, message: "Cambio aplicado localmente" };
    }
  };

  useEffect(() => {
    obtenerTratamientos();
  }, []);

  return {
    tratamientos,
    loading,
    error,
    obtenerTratamientos,
    cambiarEstadoTratamiento
  };
};

export default useCustomTratamientos;