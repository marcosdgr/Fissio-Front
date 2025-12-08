import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Iniciar sesión de usuario
 */
export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/v1/login", loginData);
  return response.data;
};

/**
 * Solicitar recuperación de contraseña
 * Envía email con link de recuperación que contiene token JWT (válido 15 min)
 * @param {string} email - Email del usuario
 */
export const envioCorreoRecuperacion = async (email) => {
  const response = await api.post("/api/auth/v1/recuperar-password", { 
    MailUsuario: email 
  });
  return response.data;
};

/**
 * Resetear contraseña usando token de recuperación
 * @param {string} token - Token JWT recibido en el link del email
 * @param {string} nuevaPassword - Nueva contraseña del usuario
 */
export const resetearContrasena = async (token, nuevaPassword) => {
  const response = await api.put(`/api/auth/v1/cambio-password/${token}`, {
    contraseña: nuevaPassword
  });
  return response.data;
};