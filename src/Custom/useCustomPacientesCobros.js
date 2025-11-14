import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomPacientesCobros = () => {
  const [pacientes, setPacientes] = useState({ pacientes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}api/pacientes/v1`);
      setPacientes({ pacientes: res.data.pacientes || [] });
    } catch (err) {
      setError("Error al cargar pacientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  return { pacientes, loading, error, obtenerPacientes };
};

export default useCustomPacientesCobros;