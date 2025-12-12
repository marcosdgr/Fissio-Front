/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomPacientesCobros = () => {
  const [pacientes, setPacientes] = useState([]);
  const [pacientesObj, setPacientesObj] = useState({ pacientes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerPacientes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/pacientesCobros/v1`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.pacientes || []);
      setPacientes(data);
      setPacientesObj({ pacientes: data });

    } catch (err) {
      setError("Error al cargar pacientes");
      setPacientes([]);
      setPacientesObj({ pacientes: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  return { pacientes, pacientesObj, loading, error, obtenerPacientes };
};

export default useCustomPacientesCobros;