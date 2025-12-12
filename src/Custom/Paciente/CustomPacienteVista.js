import axios from "axios";
import { BASE_URL } from "../../Api/api.js";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const obtenerPacientePorId = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener paciente con ID ${id}:`, error);
        throw error;
    }
} 
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
export const actualizarPaciente = async (id, pacienteData) => {
    try {
        validarDatosPaciente(pacienteData);
        const response = await api.put(`/api/pacientes/v1/actualizar/${id}`, pacienteData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar paciente con ID ${id}:`, error);
        throw error;
    }
}
export const obtenerTurnosPorPaciente = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}/turnos`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener turnos para paciente con ID ${id}:`, error);
        throw error;
    }
}
export const solicitarTurno = async (turnoData) => {
    try {
        const formData = new FormData();
        
        formData.append('FechaRequeridaTurno', turnoData.FechaRequeridaTurno);
        formData.append('HorarioRequeridoTurno', turnoData.HorarioRequeridoTurno);
        formData.append('idPaciente', turnoData.idPaciente);
        
        if (turnoData.InformeTurno && turnoData.InformeTurno.trim() !== '') {
            formData.append('InformeTurno', turnoData.InformeTurno);
        }
        
        if (turnoData.ordenMedicaFile) {
            formData.append('ordenMedica', turnoData.ordenMedicaFile);
        }

        const response = await api.post(`/api/turnos/v1/solicitar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    } catch (error) {   
        console.error(`Error al solicitar nuevo turno:`, error);
        throw error;
    } 
}
export const obtenerEstadoTurnoPorPaciente = async (idPaciente) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${idPaciente}/turnos/detalles`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener estado del turno para paciente con ID ${idPaciente}:`, error);
        throw error;
    }
}
export const obtenerEmailPacientePorId = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}/mail`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener email del paciente con ID ${id}:`, error);
        throw error;
    }
}

export const cancelarTurnoPaciente = async (idPaciente, idTurno) => {
    try {
        const response = await api.put(`/api/pacientes/v1/${idPaciente}/turnos/${idTurno}/cancelar`);   
        return response.data;
    } catch (error) {
        console.error(`Error al cancelar turno con ID ${idTurno} del paciente ${idPaciente}:`, error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al cancelar el turno');
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor');
        } else {
            throw new Error('Error al procesar la solicitud');
        }
    }
}


export const obtenerComentariosPorPaciente = async (idPaciente) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${idPaciente}/comentarios`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener comentarios del paciente con ID ${idPaciente}:`, error);
        throw error;
    }
}