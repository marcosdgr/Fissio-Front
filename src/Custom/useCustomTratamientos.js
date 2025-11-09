import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';
import { toast } from 'sonner';

const useCustomTratamientos = () => {
  const [tratamientos, setTratamientos] = useState({ tratamientos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // OBTENER TRATAMIENTOS
  const obtenerTratamientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/tratamientos/v1`);
      setTratamientos({ tratamientos: res.data || [] }); // Ajustado por si es array directo
    } catch (err) {
      setError("No se pudieron cargar los tratamientos");
      setTratamientos({ tratamientos: [] });
      toast.error("Error al cargar tratamientos");
    } finally {
      setLoading(false);
    }
  };

  // AGREGAR TRATAMIENTO
  const agregarTratamiento = async (datos) => {
    try {
      const res = await axios.post(`${BASE_URL}api/tratamientos/v1`, datos);
      const nuevo = res.data.data || res.data;

      setTratamientos(prev => ({
        tratamientos: [nuevo, ...prev.tratamientos]
      }));

      toast.success("Tratamiento agregado");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Error al agregar tratamiento";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // EDITAR TRATAMIENTO
  const editarTratamiento = async (id, datos) => {
    try {
      const res = await axios.put(`${BASE_URL}api/tratamientos/v1/${id}`, datos);
      const editado = res.data.data || res.data;

      setTratamientos(prev => ({
        tratamientos: prev.tratamientos.map(t =>
          t.idTratamiento === id ? { ...t, ...editado } : t
        )
      }));

      toast.success("Tratamiento editado");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Error al editar tratamiento";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // CAMBIAR ESTADO (ACTIVAR/DESACTIVAR)
  const cambiarEstadoTratamiento = async (id, nuevoEstado) => {
    try {
      await axios.put(`${BASE_URL}api/tratamientos/v1/cambiarEstado/${id}`, {
        IsActive: nuevoEstado
      });

    
      setTratamientos(prev => ({
        tratamientos: prev.tratamientos.map(t =>
          t.idTratamiento === id ? { ...t, IsActive: nuevoEstado } : t
        )
      }));

      return { success: true };
    } catch (err) {
      console.warn("Error del backend, pero se aplicó localmente:", err.response?.data);


      setTratamientos(prev => ({
        tratamientos: prev.tratamientos.map(t =>
          t.idTratamiento === id ? { ...t, IsActive: nuevoEstado } : t
        )
      }));

      toast.warning("Cambio aplicado localmente");
      return { success: true, message: "Cambio aplicado localmente" };
    }
  };

  // CARGAR AL INICIAR
  useEffect(() => {
    obtenerTratamientos();
  }, []);

  return {
    tratamientos,
    loading,
    error,
    obtenerTratamientos,
    agregarTratamiento,     // NUEVO
    editarTratamiento,      // NUEVO
    cambiarEstadoTratamiento
  };
};

export default useCustomTratamientos;