import axios from 'axios';
import { BASE_URL } from '../../Api/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const combinarAsistenciasConHorarios = async (asistencias) => {
  try {
    const [horariosRes, asignacionesRes] = await Promise.all([
      api.get('/api/horariosTrabajo/v1/activos'),
      api.get('/api/empleadosHorarios/v1')
    ]);

    const horarios = horariosRes.data;
    const asignaciones = asignacionesRes.data;


    const diasSemana = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Miercoles': 3, 
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Sabado': 6, 
      'Domingo': 7
    };

    return asistencias.map(asistencia => {
      const fechaAsistencia = new Date(asistencia.Fecha);
      const diaSemanaNum = fechaAsistencia.getDay(); 
      const diaSemanaAjustado = diaSemanaNum === 0 ? 7 : diaSemanaNum; 

      console.log(`🔍 Procesando asistencia - Empleado: ${asistencia.idEmpleado}, Fecha: ${asistencia.Fecha}, Día: ${diaSemanaAjustado}`);

      const asignacionesEmpleado = asignaciones.filter(a => a.idEmpleado === asistencia.idEmpleado);
      
      console.log(`   Asignaciones del empleado ${asistencia.idEmpleado}:`, asignacionesEmpleado);

      if (asignacionesEmpleado.length > 0) {
        for (const asignacion of asignacionesEmpleado) {
          const horario = horarios.find(h => {
            const diaHorario = diasSemana[h.DiaSemana] || 0;
            const coincide = h.idHorario === asignacion.idHorario && diaHorario === diaSemanaAjustado;
            
            if (h.idHorario === asignacion.idHorario) {
              console.log(`   Comparando horario ${h.idHorario}: ${h.DiaSemana} (${diaHorario}) vs día asistencia (${diaSemanaAjustado}) = ${coincide}`);
            }
            
            return coincide;
          });

          if (horario) {
            return {
              ...asistencia,
              HoraEntradaEsperada: horario.HoraEntradaEsperada || horario.HoraInicio,
              HoraSalidaEsperada: horario.HoraSalidaEsperada || horario.HoraFin,
              DiaSemanaAsignado: horario.DiaSemana
            };
          }
        }
      }

      return asistencia;
    });
  } catch (error) {
    console.error('Error al combinar asistencias con horarios:', error);
    return asistencias;
  }
};

export const obtenerAsistencias = async () => {
  try {
    const response = await api.get('/api/asistencias/v1');
    const asistenciasEnriquecidas = await combinarAsistenciasConHorarios(response.data);
    return asistenciasEnriquecidas;
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    throw error;
  }
};

export const obtenerAsistenciasPorEmpleado = async (idEmpleado) => {
  try {
    const response = await api.get(`/api/asistencias/v1/empleado/${idEmpleado}`);
    const asistenciasEnriquecidas = await combinarAsistenciasConHorarios(response.data);
    return asistenciasEnriquecidas;
  } catch (error) {
    console.error('Error al obtener asistencias por empleado:', error);
    throw error;
  }
};

export const obtenerAsistenciasPorFecha = async (fecha) => {
  try {
    const response = await api.get(`/api/asistencias/v1/fecha/${fecha}`);
    const asistenciasEnriquecidas = await combinarAsistenciasConHorarios(response.data);
    return asistenciasEnriquecidas;
  } catch (error) {
    console.error('Error al obtener asistencias por fecha:', error);
    throw error;
  }
};

export const obtenerAsistenciasPorRango = async (fechaInicio, fechaFin) => {
  try {
    const response = await api.get(`/api/asistencias/v1/rangoFechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener asistencias por rango:', error);
    throw error;
  }
};

export const obtenerEmpleadosActivos = async () => {
  try {
    const response = await api.get('/api/empleados/v1/activos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};
