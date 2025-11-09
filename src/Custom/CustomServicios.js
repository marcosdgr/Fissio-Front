import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * Obtener todos los servicios
 */
export const obtenerServicios = async () => {
    const response = await api.get("/api/servicios/v1/servicios");
    return response.data;
};

/**
 * Obtener un servicio por ID
 * @param {number} idServicio - ID del servicio
 */
export const obtenerServicioPorId = async (idServicio) => {
    const response = await api.get(`/api/servicios/v1/servicios/${idServicio}`);
    return response.data;
};
/**
 * Crear un nuevo servicio
 * @param {object} servicioData - Datos del servicio a crear
 */
export const crearServicio = async (servicioData) => {
    const response = await api.post("/api/servicios/v1/servicios", servicioData);
    return response.data;
};
/**
 * Actualizar un servicio existente
 * @param {number} idServicio - ID del servicio a actualizar
 * @param {object} servicioData - Datos del servicio a actualizar
 */
export const actualizarServicio = async (idServicio, servicioData) => {
    const response = await api.put(`/api/servicios/v1/servicios/${idServicio}`, servicioData);
    return response.data;
};
/**
 * Cambiar el estado (activo/inactivo) de un servicio
 * @param {number} idServicio - ID del servicio
 * @param {number} nuevoEstado - 1 para activar, 0 para desactivar
 */
export const cambiarEstadoServicio = async (idServicio, nuevoEstado) => {
    const response = await api.put(`/api/servicios/v1/servicios/${idServicio}/estado`, {
        IsActive: nuevoEstado
    });
    return response.data;
};


