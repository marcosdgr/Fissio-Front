import axios from "axios";
import { BASE_URL } from "../Api/api.js";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getLocalidades = async () => {
  const response = await api.get("/api/localidades/v1/");
  return response.data;
};


export const registerPaciente = async (pacienteData) => {
  const response = await api.post("/api/usuarios/v1/register", pacienteData);
  return response.data;
};

