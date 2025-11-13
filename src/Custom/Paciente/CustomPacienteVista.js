import axios from "axios";
import { BASE_URL } from "../../Api/api.js";

// Configuración de la instancia de axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//Obtener paciente por id 
export const obtenerPacientePorId = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener paciente con ID ${id}:`, error);
        throw error;
    }
}
// Validaciones para actualizar 
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
//Actualizar datos del paciente
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
//Obtener turnos por paciente a travez de su id
export const obtenerTurnosPorPaciente = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}/turnos`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener turnos para paciente con ID ${id}:`, error);
        throw error;
    }
}
//Solicitar nuevo turno (con archivo de orden médica)
export const solicitarTurno = async (turnoData) => {
    try {
        // Crear FormData para enviar archivo
        const formData = new FormData();
        
        // Agregar campos de texto
        formData.append('FechaRequeridaTurno', turnoData.FechaRequeridaTurno);
        formData.append('HorarioRequeridoTurno', turnoData.HorarioRequeridoTurno);
        formData.append('idPaciente', turnoData.idPaciente);
        
        // Agregar observaciones si existen
        if (turnoData.InformeTurno && turnoData.InformeTurno.trim() !== '') {
            formData.append('InformeTurno', turnoData.InformeTurno);
        }
        
        // Agregar archivo de orden médica si existe
        if (turnoData.ordenMedicaFile) {
            formData.append('ordenMedica', turnoData.ordenMedicaFile);
        }

        // Configurar headers para multipart/form-data
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
// traer el estado, fecha y hora requerida del turno de un paciente
export const obtenerEstadoTurnoPorPaciente = async (idPaciente) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${idPaciente}/turnos/detalles`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener estado del turno para paciente con ID ${idPaciente}:`, error);
        throw error;
    }
}
// obtener mail del paciente por id
export const obtenerEmailPacientePorId = async (id) => {
    try {
        const response = await api.get(`/api/pacientes/v1/${id}/mail`);
        return response.data;
    } catch (error) {   
        console.error(`Error al obtener email del paciente con ID ${id}:`, error);
        throw error;
    }
}

// Función para que el paciente pueda cancelar un turno
export const cancelarTurnoPaciente = async (idPaciente, idTurno) => {
    try {
        const response = await api.put(`/api/pacientes/v1/${idPaciente}/turnos/${idTurno}/cancelar`);   
        return response.data;
    } catch (error) {
        console.error(`Error al cancelar turno con ID ${idTurno} del paciente ${idPaciente}:`, error);
        // Manejar errores específicos del backend
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            throw new Error(error.response.data.message || 'Error al cancelar el turno');
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            throw new Error('No se pudo conectar con el servidor');
        } else {
            // Algo pasó al configurar la petición
            throw new Error('Error al procesar la solicitud');
        }
    }
}