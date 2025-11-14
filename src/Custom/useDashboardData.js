// src/Custom/useDashboardData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api';

const useDashboardData = () => {
  const [data, setData] = useState({
    pacientes: [],
    cobros: [],
    pagos: [],
    tratamientos: [],
    profesionales: [],
    metricas: [],
    // turnos, servicios, asistencias → NO EXISTEN → ELIMINADOS
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
        'empleados/v1',     // ← Profesionales
        'metricas/vivo'
      ];

      const requests = endpoints.map(ep => 
        axios.get(`${BASE_URL}api/${ep}`).catch(err => {
          console.warn(`Endpoint /api/${ep} falló:`, err.response?.status || err.message);
          return { data: [] };
        })
      );

      const responses = await Promise.all(requests);

      const extractData = (res) => {
        if (!res || !res.data) return [];
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
      };

      setData({
        pacientes: extractData(responses[0]),
        cobros: extractData(responses[1]),
        pagos: extractData(responses[2]),
        tratamientos: extractData(responses[3]),
        profesionales: extractData(responses[4]),
        metricas: extractData(responses[5])
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
  }, []);

  return { data, loading, error, refetch: fetchAll };
};

export default useDashboardData;