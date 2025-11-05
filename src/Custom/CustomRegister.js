import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

console.log("BASE_URL configurada:", BASE_URL);

// Configuración base de axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para debug
api.interceptors.request.use(request => {
  console.log('Realizando petición a:', request.baseURL + request.url);
  console.log('Método:', request.method);
  console.log('Data:', request.data);
  return request;
});

// Obtener todas las localidades activas

export const getLocalidades = async () => {
  try {
    const response = await api.get('/api/localidades/v1/');
    return response.data;
  } catch (error) {
    console.error("Error en getLocalidades:", error);
    console.error("URL:", `${BASE_URL}/api/localidades/v1/`);
    throw error;
  }
};


 // Registrar un nuevo paciente

export const registerPaciente = async (pacienteData) => {
  try {
    const response = await api.post('/api/usuarios/v1/register', pacienteData);
    return response.data;
  } catch (error) {
    console.error("Error en registerPaciente:", error);
    console.error("URL:", `${BASE_URL}/api/usuarios/v1/register`);
    console.error("Data enviada:", pacienteData);
    throw error; // Re-lanzamos el error para que lo maneje el componente
  }
};


