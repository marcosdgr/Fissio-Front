import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomMediosPago = () => {
  const [mediosPago, setMediosPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerMediosPago = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/cobros/medios-pago`);
      const medios = res.data.mediosPago || res.data.data || res.data || [];
      setMediosPago(medios);
    } catch (err) {
      console.error("Error al cargar medios de pago:", err);
      setError(err.response?.data?.message || "Error al cargar medios de pago");
      setMediosPago([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMediosPago();
  }, []);

  return { 
    mediosPago, 
    loading, 
    error, 
    obtenerMediosPago 
  };
};

export default useCustomMediosPago;
