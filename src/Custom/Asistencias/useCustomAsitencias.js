import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '../../Api/api';
import { showSuccess, showError, showConfirm, showLoading, closeSwal } from '../../Utils/sweetAlerts';

export const useCustomAsistencias = (idEmpleado) => {
    const [asistencias, setAsistencias] = useState([]);
    const [horariosSemanales, setHorariosSemanales] = useState([]);
    const [asistenciaActual, setAsistenciaActual] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        mes: '',
        anio: new Date().getFullYear()
    });

    // Obtener horarios semanales del empleado
    const obtenerHorariosSemanales = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}api/empleadosHorarios/v1`);
            const data = await response.json();
            
            if (response.ok) {
                // Filtrar solo los horarios del empleado actual
                const horariosEmpleado = data.filter(h => h.idEmpleado === parseInt(idEmpleado));
                setHorariosSemanales(horariosEmpleado);
            } else {
                showError('Error', 'No se pudieron cargar los horarios');
            }
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            showError('Error', 'Error de conexión al obtener horarios');
        } finally {
            setLoading(false);
        }
    }, [idEmpleado]);

    // Obtener asistencias del empleado
    const obtenerAsistenciasEmpleado = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}api/asistencias/v1/empleado/${idEmpleado}`);
            const data = await response.json();
            
            if (response.ok) {
                setAsistencias(data);
            } else if (response.status === 404) {
                setAsistencias([]);
            } else {
                showError('Error', 'No se pudieron cargar las asistencias');
            }
        } catch (error) {
            console.error('Error al obtener asistencias:', error);
            showError('Error', 'Error de conexión al obtener asistencias');
        } finally {
            setLoading(false);
        }
    }, [idEmpleado]);

    // Verificar si ya existe una asistencia activa para hoy
    const verificarAsistenciaHoy = useCallback(async () => {
        try {
            const hoy = new Date().toISOString().split('T')[0];
            const response = await fetch(`${BASE_URL}api/asistencias/v1/empleado/${idEmpleado}`);
            const data = await response.json();
            
            if (response.ok && data.length > 0) {
                const asistenciaHoy = data.find(a => a.Fecha.split('T')[0] === hoy);
                // Siempre guardar la asistencia de hoy (completa o incompleta)
                if (asistenciaHoy) {
                    setAsistenciaActual(asistenciaHoy);
                } else {
                    setAsistenciaActual(null);
                }
            } else {
                setAsistenciaActual(null);
            }
        } catch (error) {
            console.error('Error al verificar asistencia hoy:', error);
        }
    }, [idEmpleado]);

    // Registrar entrada (inicio de jornada)
    const registrarEntrada = async (observaciones = '') => {
        if (!idEmpleado) {
            showError('Error', 'No se pudo identificar al empleado');
            return false;
        }

        try {
            showLoading('Registrando entrada...');
            
            const ahora = new Date();
            const fecha = ahora.toISOString().split('T')[0];
            const hora = ahora.toTimeString().split(' ')[0];

            const body = {
                Fecha: fecha,
                HoraEntrada: hora,
                idEmpleado: parseInt(idEmpleado),
                Observaciones: observaciones || null
            };

            console.log('Enviando datos de entrada:', body);

            const response = await fetch(`${BASE_URL}api/asistencias/v1/registrarEntrada`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            closeSwal();

            if (response.ok) {
                showSuccess('¡Entrada registrada!', `Hora: ${hora}`);
                await obtenerAsistenciasEmpleado();
                await verificarAsistenciaHoy();
                return true;
            } else {
                showError('Error', data.message || 'No se pudo registrar la entrada');
                return false;
            }
        } catch (error) {
            closeSwal();
            console.error('Error al registrar entrada:', error);
            showError('Error', 'Error de conexión al registrar entrada');
            return false;
        }
    };

    // Registrar salida (fin de jornada)
    const registrarSalida = async (observaciones = '') => {
        if (!asistenciaActual) {
            showError('Error', 'No hay una entrada registrada para hoy');
            return false;
        }

        try {
            const resultado = await showConfirm(
                '¿Finalizar jornada?',
                '¿Deseas registrar tu salida?',
                'Sí, registrar salida',
                'Cancelar'
            );

            if (!resultado.isConfirmed) return false;

            showLoading('Registrando salida...');
            
            const ahora = new Date();
            const hora = ahora.toTimeString().split(' ')[0];

            const response = await fetch(`${BASE_URL}api/asistencias/v1/registrarSalida/${asistenciaActual.idAsistencia}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    HoraSalida: hora,
                    Observaciones: observaciones
                })
            });

            const data = await response.json();
            closeSwal();

            if (response.ok) {
                showSuccess('¡Salida registrada!', `Hora: ${hora}`);
                await obtenerAsistenciasEmpleado();
                setAsistenciaActual(null);
                return true;
            } else {
                showError('Error', data.message || 'No se pudo registrar la salida');
                return false;
            }
        } catch (error) {
            closeSwal();
            console.error('Error al registrar salida:', error);
            showError('Error', 'Error de conexión al registrar salida');
            return false;
        }
    };

    // Obtener asistencias por rango de fechas
    const obtenerAsistenciasPorRango = async (fechaInicio, fechaFin) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}api/asistencias/v1/rangoFechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            const data = await response.json();
            
            if (response.ok) {
                // Filtrar solo las del empleado actual
                const asistenciasFiltradas = data.filter(a => a.idEmpleado === idEmpleado);
                setAsistencias(asistenciasFiltradas);
            } else if (response.status === 404) {
                setAsistencias([]);
            } else {
                showError('Error', 'No se pudieron cargar las asistencias');
            }
        } catch (error) {
            console.error('Error al obtener asistencias por rango:', error);
            showError('Error', 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar por mes
    const filtrarPorMes = (mes, anio) => {
        const primerDia = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
        const ultimoDia = new Date(anio, mes, 0).toISOString().split('T')[0];
        obtenerAsistenciasPorRango(primerDia, ultimoDia);
    };

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (asistencias.length === 0) {
            return {
                totalDias: 0,
                horasTrabajadas: 0,
                diasCompletos: 0,
                diasIncompletos: 0
            };
        }

        let horasTotales = 0;
        let diasCompletos = 0;
        let diasIncompletos = 0;

        asistencias.forEach(asistencia => {
            if (asistencia.HoraEntrada && asistencia.HoraSalida) {
                const entrada = new Date(`2000-01-01T${asistencia.HoraEntrada}`);
                const salida = new Date(`2000-01-01T${asistencia.HoraSalida}`);
                const diff = (salida - entrada) / (1000 * 60 * 60); // Diferencia en horas
                horasTotales += diff;
                
                if (diff >= 6) {
                    diasCompletos++;
                } else {
                    diasIncompletos++;
                }
            } else {
                diasIncompletos++;
            }
        });

        return {
            totalDias: asistencias.length,
            horasTrabajadas: Math.round(horasTotales * 100) / 100,
            diasCompletos,
            diasIncompletos
        };
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        if (idEmpleado) {
            obtenerHorariosSemanales();
            obtenerAsistenciasEmpleado();
            verificarAsistenciaHoy();
        }
    }, [idEmpleado, obtenerHorariosSemanales, obtenerAsistenciasEmpleado, verificarAsistenciaHoy]);

    return {
        asistencias,
        horariosSemanales,
        asistenciaActual,
        loading,
        filtros,
        setFiltros,
        registrarEntrada,
        registrarSalida,
        obtenerAsistenciasEmpleado,
        obtenerAsistenciasPorRango,
        filtrarPorMes,
        calcularEstadisticas,
        verificarAsistenciaHoy
    };
};
