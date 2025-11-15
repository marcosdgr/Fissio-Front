import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useDashboardData = () => {
  const [data, setData] = useState({
    pacientes: [],
    cobros: [],
    pagos: [],
    tratamientos: [],
    profesionales: [],
    metricas: [],
    turnos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        'pacientes/v1',          
        'cobros/v1',          
        'pagos/v1',              
        'tratamientos/v1',       
        'empleados/v1',      
        'metricas/vivo',        
        'turnos/v1'               
      ];

      const requests = endpoints.map(ep =>
        axios.get(`${BASE_URL}api/${ep}`).catch(err => {
          console.warn(`Endpoint /api/${ep} falló:`, err.response?.status || err.message);
          return { data: null };
        })
      );

      const responses = await Promise.all(requests);

      const extractArray = (res, key = null) => {
        if (!res || !res.data) return [];
        if (Array.isArray(res.data)) return res.data;
        if (key && res.data[key]) return res.data[key];
        return [];
      };

      setData({
        pacientes: extractArray(responses[0], 'pacientes'),
        cobros: extractArray(responses[1]),
        pagos: extractArray(responses[2]),
        tratamientos: extractArray(responses[3]),
        profesionales: extractArray(responses[4]),
        metricas: extractArray(responses[5], 'metricas'),
        turnos: extractArray(responses[6], 'turnos')
      });
    } catch (err) {
      console.error("Error en dashboard:", err);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000); 
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchAll };
};

export default useDashboardData;