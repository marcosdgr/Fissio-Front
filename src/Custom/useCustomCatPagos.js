import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api.js';
import { toast } from 'sonner';

const useCustomCatPagos = () => {
  const [mediosPago, setMediosPago] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerMedios = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/catMedioPago/v1`);
      setMediosPago(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Error al cargar medios de pago");
    }
  };

  const obtenerTipos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/catTipoPago/v1`);
      setTiposPago(res.data || []);
    } catch (err) { 
      console.log(err);
      toast.error("Error al cargar tipos de pago");
    }
  };

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      await Promise.all([obtenerMedios(), obtenerTipos()]);
      setLoading(false);
    };
    cargar();
  }, []);

  return {
    mediosPago,
    tiposPago,
    loading,
    refresh: () => {
      obtenerMedios();
      obtenerTipos();
    }
  };
};

export default useCustomCatPagos;