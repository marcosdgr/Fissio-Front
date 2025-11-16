// src/Custom/useCustomMetricasEnVivo.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../Api/api';
import { toast } from 'sonner';

const useCustomMetricas = () => {
  const [metrica, setMetrica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerMetrica = async (tipo = 'dia', fecha = null) => {
    let fechaParam = null;

    if (fecha) {
      if (tipo === 'dia') {
        fechaParam = fecha; // YYYY-MM-DD
      } else if (tipo === 'semana') {
        const [year, week] = fecha.split('-W');
        const d = new Date(parseInt(year), 0, (parseInt(week) - 1) * 7 + 1);
        const day = d.getDay();
        const monday = new Date(d);
        monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
        fechaParam = monday.toISOString().split('T')[0];
      } else if (tipo === 'mes') {
        // Para mes: formato YYYY-MM -> convertir a YYYY-MM-15 (mitad del mes)
        // Esto evita problemas de zona horaria donde el backend podría restar un día
        fechaParam = `${fecha}-15`;
      }
    }

    try {
      setLoading(true);
      console.log('Solicitando métricas:', { tipo, fecha: fechaParam });
      const res = await axios.get(`${BASE_URL}api/metricas/vivo`, {
        params: { tipo, fecha: fechaParam }
      });

      const data = res.data;
      console.log('Respuesta del servidor (métricas):', data);
      console.log('IngresosCobrados recibido:', data.IngresosCobrados, 'tipo:', typeof data.IngresosCobrados);
      console.log('EgresosPagados recibido:', data.EgresosPagados, 'tipo:', typeof data.EgresosPagados);

      const parseada = {
        ...data,
        IngresosCobrados: parseFloat(data.IngresosCobrados) || 0,
        EgresosPagados: parseFloat(data.EgresosPagados) || 0,
        BalanceDelDia: parseFloat(data.BalanceDelDia) || 0,
        TurnosProgramados: parseInt(data.TurnosProgramados) || 0,
        TurnosAtendidos: parseInt(data.TurnosAtendidos) || 0,
        HorasTrabajadasTotales: parseFloat(data.HorasTrabajadasTotales) || 0,
        HorasEmpleadoTop: parseFloat(data.HorasEmpleadoTop) || 0,
        VecesServicioTop: parseInt(data.VecesServicioTop) || 0,
        TurnosPacienteTop: parseInt(data.TurnosPacienteTop) || 0,
        NuevosPacientes: parseInt(data.NuevosPacientes) || 0,
        CalificacionPromedio: parseFloat(data.CalificacionPromedio) || 0,
        TipoRango: data.TipoRango || 'dia',
        FechaBalance: data.FechaBalance || ''
      };

      setMetrica(parseada);
      toast.success(`Métricas ${tipo} cargadas`);
    } catch (err) {
      console.error("ERROR MÉTRICAS:", err.response || err);
      setError("Error al cargar métricas");
      toast.error("Error al cargar métricas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMetrica();
  }, []);

  return { metrica, loading, error, obtenerMetrica };
};

export default useCustomMetricas;