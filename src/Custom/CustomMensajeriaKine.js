import axios from "axios";
import { BASE_URL } from "../../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const getToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token || authData?.usuario?.token;
    console.log('Token extraído (kine):', token ? `${token.substring(0, 20)}...` : 'NO HAY');
    return token || "";
  } catch (err) {
    console.error("Error leyendo token del localStorage:", err);
    return "";
  }
};

const getHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getActiveEmployees = async () => {
  console.log('API Kine: Obteniendo empleados activos...');
  const response = await api.get("/api/empleados/v1/activos", { headers: getHeaders() });
  console.log('Empleados obtenidos:', response.data);
  return response.data;
};

export const getConversation = async (idUsuario1, idUsuario2) => {
  console.log(`API Kine: Conversación entre ${idUsuario1} y ${idUsuario2}`);
  const response = await api.get(`/api/mensajes-internos/v1/conversacion/${idUsuario1}/${idUsuario2}`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const sendMessage = async (mensaje, destinatarios = []) => {
  console.log('API Kine: Enviando mensaje...', { mensaje, destinatarios });
  const body = { mensaje, destinatarios };
  const response = await api.post("/api/mensajes-internos/v1/enviar", body, {
    headers: getHeaders(),
  });
  console.log('Mensaje enviado:', response.data);
  return response.data;
};

export const markAsRead = async (idNotificacion, idEmpleadoDestinatario) => {
  console.log('API Kine: Marcando como leído...', { idNotificacion, idEmpleadoDestinatario });
  const body = { idNotificacion, idEmpleadoDestinatario };
  const response = await api.put("/api/mensajes-internos/v1/leido", body, {
    headers: getHeaders(),
  });
  return response.data;
};

export default {
  getActiveEmployees,
  getConversation,
  sendMessage,
  markAsRead,
};