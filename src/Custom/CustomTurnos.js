import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Obtener turnos del día
 * @param {string} fecha - Fecha en formato YYYY-MM-DD (opcional, por defecto hoy)
 */
export const getTurnosDelDia = async (fecha = null) => {
  const params = fecha ? { fecha } : {};
  const response = await api.get("/api/turnos/v1/turnos-del-dia", { params });
  return response.data;
};

/**
 * Asignar recursos a un turno (sala y kinesiólogo)
 * @param {number} idTurno - ID del turno
 * @param {object} recursos - Objeto con los recursos a asignar
 */
export const asignarRecursos = async (idTurno, recursos) => {
  const response = await api.put(`/api/turnos/v1/asignar-recursos/${idTurno}`, recursos);
  return response.data;
};

/**
 * Obtener kinesiologos activos para asignar
 */
export const getKinesiologos = async () => {
  const response = await api.get("/api/turnos/v1/kinesiologos-disponibles");
  return response.data;
};

/**
 * Obtener salas disponibles
 */
export const getSalas = async () => {
  const response = await api.get("/api/turnos/v1/salas-disponibles");
  return response.data;
};