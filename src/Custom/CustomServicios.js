import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const obtenerTodosServicios = async () => {
    const response = await api.get("/api/servicios/v1/servicios/todos");
    return response.data;
};

export const obtenerServicios = async () => {
    const response = await api.get("/api/servicios/v1/servicios");
    return response.data;
};

export const obtenerServicioPorId = async (idServicio) => {
    const response = await api.get(`/api/servicios/v1/servicios/${idServicio}`);
    return response.data;
};

export const crearServicio = async (servicioData) => {
    const response = await api.post("/api/servicios/v1/servicios", servicioData);
    return response.data;
};

export const actualizarServicio = async (idServicio, servicioData) => {
    const response = await api.put(`/api/servicios/v1/servicios/${idServicio}`, servicioData);
    return response.data;
};

export const cambiarEstadoServicio = async (idServicio, nuevoEstado) => {
    const response = await api.put(`/api/servicios/v1/servicios/${idServicio}/estado`, {
        IsActive: nuevoEstado
    });
    return response.data;
};
