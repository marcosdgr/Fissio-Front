import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';
import { toast } from 'sonner';

const useCustomCobros = () => {
  const [cobros, setCobros] = useState({ cobros: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerCobros = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/cobros/v1`);
      setCobros({ cobros: res.data });
    } catch (err) {
      setError("Error al cargar cobros");
      setCobros({ cobros: [] });
      toast.error("Error al cargar cobros");
    } finally {
      setLoading(false);
    }
  };

  const agregarCobro = async (datos) => {
    try {
      const res = await axios.post(`${BASE_URL}api/cobros/v1`, datos);
      const nuevo = res.data;
      setCobros(prev => ({ cobros: [nuevo, ...prev.cobros] }));
      toast.success("Cobro agregado");
      return { success: true };
    } catch (err) {
      toast.error("Error al agregar");
      return { success: false };
    }
  };

  const editarCobro = async (id, datos) => {
    try {
      await axios.put(`${BASE_URL}api/cobros/v1/${id}`, datos);
      setCobros(prev => ({
        cobros: prev.cobros.map(c => c.idCobro === id ? { ...c, ...datos } : c)
      }));
      toast.success("Cobro editado");
      return { success: true };
    } catch (err) {
      toast.error("Error al editar");
      return { success: false };
    }
  };

  const eliminarCobro = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/cobros/v1/${id}`);
      setCobros(prev => ({ cobros: prev.cobros.filter(c => c.idCobro !== id) }));
      toast.success("Cobro eliminado");
      return { success: true };
    } catch (err) {
      toast.error("Error al eliminar");
      return { success: false };
    }
  };

  useEffect(() => {
    obtenerCobros();
  }, []);

  return {
    cobros,
    loading,
    error,
    obtenerCobros,
    agregarCobro,
    editarCobro,
    eliminarCobro
  };
};

export default useCustomCobros;