import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomTurnosCobros = () => {
  const [turnos, setTurnos] = useState({ turnos: [] });
  const [loading, setLoading] = useState(true);

  const obtenerTurnos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/turnos/v1`);
      const turnosConCobrado = (res.data.turnos || []).map(t => ({
        ...t,
        cobrado: false 
      }));

      // Detectar si tiene cobro
      const cobrosRes = await axios.get(`${BASE_URL}api/cobros/v1`);
      const cobrosIds = new Set(cobrosRes.data.map(c => c.idTurno));
      
      const finalTurnos = turnosConCobrado.map(t => ({
        ...t,
        cobrado: cobrosIds.has(t.idTurno)
      }));

      setTurnos({ turnos: finalTurnos });
    } catch (err) {
      console.error("Error cargando turnos para cobros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  return { turnos, loading, obtenerTurnos };
};

export default useCustomTurnosCobros;