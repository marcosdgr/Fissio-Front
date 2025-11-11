import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';
import { toast } from 'sonner';

const useCustomPagos = () => {
  const [pagos, setPagos] = useState({ pagos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/pagos/v1`);
      setPagos({ pagos: res.data || [] });
    } catch (err) {
      setError("No se pudieron cargar los pagos");
      setPagos({ pagos: [] });
      toast.error("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  const crearPago = async (datos) => {
    try {
      const res = await axios.post(`${BASE_URL}api/pagos/v1`, datos);
      const nuevo = res.data || datos;
      setPagos(prev => ({ pagos: [nuevo, ...prev.pagos] }));
      toast.success("Pago agregado");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Error al crear pago";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const actualizarPago = async (id, datos) => {
    try {
      const res = await axios.put(`${BASE_URL}api/pagos/v1/${id}`, datos);
      const editado = res.data || datos;
      setPagos(prev => ({
        pagos: prev.pagos.map(p => p.idPago === id ? { ...p, ...editado } : p)
      }));
      toast.success("Pago editado");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Error al editar pago";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // ELIMINAR PAGO
  const eliminarPago = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/pagos/v1/${id}`);
      setPagos(prev => ({
        pagos: prev.pagos.filter(p => p.idPago !== id)
      }));
      toast.success("Pago eliminado");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Error al eliminar el pago";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  return {
    pagos,
    loading,
    error,
    obtenerPagos,
    crearPago,
    actualizarPago,
    eliminarPago
  };
};

export default useCustomPagos;