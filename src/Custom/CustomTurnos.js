import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// solicitar turno 
export const solicitarTurno = async (turnoData) => {
  const response = await api.post("/api/turnos/v1/solicitar-secretaria", turnoData);
  return response.data;
};

/**
 * Obtener disponibilidad de horarios para una fecha específica
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
export const getDisponibilidadHorarios = async (fecha) => {
  const response = await api.get(`/api/turnos/v1/disponibilidad-horarios/${fecha}`);
  return response.data;
};

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
 * Obtener kinesiologos presentes para una fecha específica
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
export const getKinesiologosDisponibles = async (fecha) => {
  const response = await api.get("/api/turnos/v1/kinesiologos-disponibles", { 
    params: { fecha } 
  });
  return response.data;
};

/**
 * Finalizar un turno que está en curso
 * @param {number} idTurno - ID del turno
 * @param {object} finalizacionData - Datos para finalizar el turno
 */
export const finalizarTurno = async (idTurno, finalizacionData) => {
  const response = await api.put(`/api/turnos/v1/finalizar/${idTurno}`, finalizacionData);
  return response.data;
};

/**
 * Cancelar un turno
 * @param {number} idTurno - ID del turno a cancelar
 */
export const cancelarTurno = async (idTurno) => {
  const response = await api.put(`/api/turnos/v1/cancelar/${idTurno}`);
  return response.data;
};

/**
 * Solicitar turno desde web (con archivo)
 * @param {FormData} formData - Datos del turno incluyendo archivo opcional
 */
export const solicitarTurnoWeb = async (formData) => {
  const response = await api.post("/api/turnos/v1/solicitar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Obtener detalles completos de un turno
 * @param {number} idTurno - ID del turno
 */
export const obtenerDetallesTurno = async (idTurno) => {
  const response = await api.get(`/api/turnos/v1/detalles/${idTurno}`);
  return response.data;
};