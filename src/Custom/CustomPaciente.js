import axios from "axios";
import { BASE_URL } from "../Api/api.js";

// Configuración de la instancia de axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});



/** Obtener todos los pacientes */
export const obtenerPacientes = async () => {
    try {
        const response = await api.get("/api/pacientes/v1/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        throw error;
    }
};

const validarDatosPaciente = (pacienteData) => {
  const camposRequeridos = [
    'NombrePaciente', 'ApellidoPaciente', 'DNI', 'FechaNacPaciente',
    'TelefonoPaciente', 'DireccionPaciente', 'Sexo', 'idLocalidad'
  ];

  // Verificar campos requeridos
  for (const campo of camposRequeridos) {
    if (!pacienteData[campo] || pacienteData[campo].toString().trim() === '') {
      throw new Error(`El campo ${campo} es requerido`);
    }
  }

  // Validaciones específicas de Sexo
  const sexoOriginal = pacienteData.Sexo.toString().trim();
  
  // Normalizar a formato completo que espera el backend
  let sexoNormalizado = sexoOriginal.toUpperCase();
  if (sexoNormalizado === 'M' || sexoNormalizado === 'MASCULINO' || sexoNormalizado.startsWith('M')) {
    sexoNormalizado = 'Masculino';
  } else if (sexoNormalizado === 'F' || sexoNormalizado === 'FEMENINO' || sexoNormalizado.startsWith('F')) {
    sexoNormalizado = 'Femenino';
  } else {
    throw new Error('El sexo debe ser M (Masculino) o F (Femenino)');
  }

  // Validar fecha
  const fecha = new Date(pacienteData.FechaNacPaciente);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha de nacimiento no tiene un formato válido');
  }

  // Validar DNI (que sea numérico)
  if (!/^\d+$/.test(pacienteData.DNI.toString().trim())) {
    throw new Error('El DNI debe contener solo números');
  }

  // Limpiar y formatear datos
  return {
    ...pacienteData,
    NombrePaciente: pacienteData.NombrePaciente.trim(),
    ApellidoPaciente: pacienteData.ApellidoPaciente.trim(),
    DNI: pacienteData.DNI.toString().trim(),
    TelefonoPaciente: pacienteData.TelefonoPaciente.toString().trim(),
    DireccionPaciente: pacienteData.DireccionPaciente.trim(),
    Sexo: sexoNormalizado, // Será 'Masculino' o 'Femenino' para el backend
    idLocalidad: parseInt(pacienteData.idLocalidad),
    FechaNacPaciente: pacienteData.FechaNacPaciente
  };
};


/** Crear un nuevo paciente
 * @param {object} pacienteData - Datos del paciente a crear
 * @returns {Promise<object>} Datos del paciente creado
 */
export const crearPaciente = async (pacienteData) => {
    try {
        const datosValidados = validarDatosPaciente({ ...pacienteData });

        const response = await api.post("/api/pacientes/v1/", datosValidados);
        return response.data;
    } catch (error) {
        console.error("Error al crear paciente:", error);
        throw error;
    }
};

/** Actualizar un paciente existente
 * @param {number} idPaciente - ID del paciente a actualizar
 * @param {object} pacienteData - Datos del paciente a actualizar
 * @returns {Promise<object>} Datos del paciente actualizado
 */
export const actualizarPaciente = async (idPaciente, pacienteData) => {
    try {
        const datosValidados = validarDatosPaciente({ ...pacienteData });
        const response = await api.put(`/api/pacientes/v1/actualizar/${idPaciente}`, datosValidados);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        throw error;
    }
};

/** Cambiar el estado (activo/inactivo) de un paciente
 * @param {number} idPaciente - ID del paciente
 * @param {number} nuevoEstado - 1 para activar, 0 para desactivar
 */
export const cambiarEstadoPaciente = async (idPaciente, nuevoEstado) => {
    try {
        const response = await api.put(`/api/pacientes/v1/estado/${idPaciente}`, { IsActive: nuevoEstado });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar estado de paciente:", error);
        throw error;
    }
};

/** Obtener todas las localidades disponibles
 * @returns {Promise<Array>} Lista de localidades
 */
export const obtenerLocalidades = async () => {
    try {
        const response = await api.get("/api/pacientes/v1/localidades");
        return response.data;
    } catch (error) {
        console.error("Error al obtener localidades:", error);
        throw error;
    }
};


