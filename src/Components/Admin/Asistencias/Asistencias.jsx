import { useState, useEffect } from 'react';
import { obtenerAsistencias, obtenerAsistenciasPorEmpleado, obtenerAsistenciasPorFecha, obtenerAsistenciasPorRango } from '../../../Custom/Asistencias/useCustomAsistenciasAdmin';
import '../../../Css/Admin/Asistencias/Asistencias.css';
import AsistenciasFiltrar from './AsistenciasFiltrar';
import AsistenciasTabla from './AsistenciasTabla';
import AsistenciasEstadisticas from './AsistenciasEstadisticas';

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    empleado: '',
    fecha: '',
    mes: '',
    anio: new Date().getFullYear(),
    fechaInicio: '',
    fechaFin: '',
    busqueda: ''
  });

  const fetchAsistencias = async () => {
    try {
      setLoading(true);
      const data = await obtenerAsistencias();
      setAsistencias(data);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      let data;
      if (filtros.empleado) {
        data = await obtenerAsistenciasPorEmpleado(filtros.empleado);
      }
      else if (filtros.fecha) {
        data = await obtenerAsistenciasPorFecha(filtros.fecha);
      }
      else if (filtros.mes && filtros.anio) {
        const primerDia = new Date(filtros.anio, filtros.mes - 1, 1).toISOString().split('T')[0];
        const ultimoDia = new Date(filtros.anio, filtros.mes, 0).toISOString().split('T')[0];
        data = await obtenerAsistenciasPorRango(primerDia, ultimoDia);
      }
      else {
        data = await obtenerAsistencias();
      }
      setAsistencias(data);
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      empleado: '',
      fecha: '',
      mes: '',
      anio: new Date().getFullYear(),
      fechaInicio: '',
      fechaFin: '',
      busqueda: ''
    });
    fetchAsistencias();
  };

  const asistenciasFiltradas = asistencias.filter(asistencia => {
    if (!filtros.busqueda) return true;
    const busqueda = filtros.busqueda.toLowerCase();
    return (
      asistencia.NombreEmpleado?.toLowerCase().includes(busqueda) ||
      asistencia.ApellidoEmpleado?.toLowerCase().includes(busqueda) ||
      asistencia.DNI?.includes(busqueda)
    );
  });

  const calcularEstadisticas = () => {
    const total = asistenciasFiltradas.length;
    const completas = asistenciasFiltradas.filter(a => a.HoraEntrada && a.HoraSalida).length;
    const incompletas = asistenciasFiltradas.filter(a => a.HoraEntrada && !a.HoraSalida).length;

    return {
      total,
      completas,
      incompletas
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className="asistencias-admin-container">
      <AsistenciasEstadisticas estadisticas={estadisticas} />

      <AsistenciasFiltrar
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onAplicarFiltros={aplicarFiltros}
        onLimpiarFiltros={limpiarFiltros}
      />

      <AsistenciasTabla
        asistencias={asistenciasFiltradas}
        loading={loading}
      />
    </div>
  );
};

export default Asistencias;
