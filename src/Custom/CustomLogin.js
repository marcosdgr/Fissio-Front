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
