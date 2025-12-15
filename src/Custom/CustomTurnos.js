import axios from "axios";
import { BASE_URL } from "../Api/api.js";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const solicitarTurno = async (turnoData) => {
  const response = await api.post("/api/turnos/v1/solicitar-secretaria", turnoData);
  return response.data;
};

export const getDisponibilidadHorarios = async (fecha) => {
  const response = await api.get(`/api/turnos/v1/disponibilidad-horarios/${fecha}`);
  return response.data;
};

export const getTurnosDelDia = async (fecha = null) => {
  const params = fecha ? { fecha } : {};
  const response = await api.get("/api/turnos/v1/turnos-del-dia", { params });
  return response.data;
};

export const asignarRecursos = async (idTurno, recursos) => {
  const response = await api.put(`/api/turnos/v1/asignar-recursos/${idTurno}`, recursos);
  return response.data;
};

export const getKinesiologosDisponibles = async (fecha) => {
  const response = await api.get("/api/turnos/v1/kinesiologos-disponibles", { 
    params: { fecha } 
  });
  return response.data;
};

export const finalizarTurno = async (idTurno, finalizacionData) => {
  try {
    const response = await api.put(`/api/turnos/v1/finalizar/${idTurno}`, finalizacionData);
    return response.data;
  } catch (error) {
    console.error('Error en finalizarTurno:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelarTurno = async (idTurno) => {
  const response = await api.put(`/api/turnos/v1/cancelar/${idTurno}`);
  return response.data;
};

export const solicitarTurnoWeb = async (formData) => {
  const response = await api.post("/api/turnos/v1/solicitar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const obtenerDetallesTurno = async (idTurno) => {
  const response = await api.get(`/api/turnos/v1/detalles/${idTurno}`);
  return response.data;
};

export const obtenerServicios = async () => {
  const response = await api.get("/api/servicios/v1/servicios");
  return response.data;
};

export const crearTurnoServicio = async (turnoServicioData) => {
  const response = await api.post("/api/turnos-servicios/v1/crear", turnoServicioData);
  return response.data;
};

export const obtenerTratamientos = async () => {
  const response = await api.get("/api/tratamientos/v1");
  return response.data;
};

export const asignarTratamientoATurno = async (turnoTratamientoData) => {
  const response = await api.post("/api/turno-tratamientos/v1/asignar", turnoTratamientoData);
  return response.data;
};

export const turnosKinesiologoDelDia = async (idEmpleado) => {
  const response = await api.get(`/api/turnos/v1/turnos-kinesiologo/${idEmpleado}`);
  return response.data;
}