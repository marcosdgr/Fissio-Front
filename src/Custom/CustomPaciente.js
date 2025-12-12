import axios from "axios";
import { BASE_URL } from "../Api/api.js";


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


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

  for (const campo of camposRequeridos) {
    if (!pacienteData[campo] || pacienteData[campo].toString().trim() === '') {
      throw new Error(`El campo ${campo} es requerido`);
    }
  }

  const sexoOriginal = pacienteData.Sexo.toString().trim();
  
  let sexoNormalizado = sexoOriginal.toUpperCase();
  if (sexoNormalizado === 'M' || sexoNormalizado === 'MASCULINO' || sexoNormalizado.startsWith('M')) {
    sexoNormalizado = 'Masculino';
  } else if (sexoNormalizado === 'F' || sexoNormalizado === 'FEMENINO' || sexoNormalizado.startsWith('F')) {
    sexoNormalizado = 'Femenino';
  } else {
    throw new Error('El sexo debe ser M (Masculino) o F (Femenino)');
  }

  const fecha = new Date(pacienteData.FechaNacPaciente);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha de nacimiento no tiene un formato válido');
  }

  if (!/^\d+$/.test(pacienteData.DNI.toString().trim())) {
    throw new Error('El DNI debe contener solo números');
  }

  return {
    ...pacienteData,
    NombrePaciente: pacienteData.NombrePaciente.trim(),
    ApellidoPaciente: pacienteData.ApellidoPaciente.trim(),
    DNI: pacienteData.DNI.toString().trim(),
    TelefonoPaciente: pacienteData.TelefonoPaciente.toString().trim(),
    DireccionPaciente: pacienteData.DireccionPaciente.trim(),
    Sexo: sexoNormalizado, 
    idLocalidad: parseInt(pacienteData.idLocalidad),
    FechaNacPaciente: pacienteData.FechaNacPaciente
  };
};

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

export const cambiarEstadoPaciente = async (idPaciente, nuevoEstado) => {
    try {
        const response = await api.put(`/api/pacientes/v1/estado/${idPaciente}`, { IsActive: nuevoEstado });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar estado de paciente:", error);
        throw error;
    }
};

export const obtenerLocalidades = async () => {
    try {
        const response = await api.get("/api/pacientes/v1/localidades");
        return response.data;
    } catch (error) {
        console.error("Error al obtener localidades:", error);
        throw error;
    }
};


