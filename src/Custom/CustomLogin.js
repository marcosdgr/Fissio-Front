import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/v1/login", loginData);
  return response.data;
};

export const envioCorreoRecuperacion = async (email) => {
  const response = await api.post("/api/auth/v1/recuperar-password", { 
    MailUsuario: email 
  });
  return response.data;
};

export const resetearContrasena = async (token, nuevaPassword) => {
  const response = await api.put(`/api/auth/v1/cambio-password/${token}`, {
    contraseña: nuevaPassword
  });
  return response.data;
};