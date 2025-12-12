/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { obtenerPacientes } from './CustomPaciente.js';

const usePacientesWrapper = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerPacientes();
      const array = Array.isArray(data) ? data : (data?.pacientes || []);
      setPacientes(array);
    } catch (err) {
      setError("Error al cargar pacientes");
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return { pacientes, loading, error, refetch: fetchPacientes };
};

export default usePacientesWrapper;