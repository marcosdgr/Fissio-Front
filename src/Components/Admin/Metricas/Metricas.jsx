import { useState } from "react";
import useCustomMetricasEnVivo from "../../../Custom/useCustomMetricas";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import "../../../Css/Metricas/Metricas.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const MetricasEnVivo = () => {
  const [tipo, setTipo] = useState('dia');
  const [fecha, setFecha] = useState('');
  const { metrica, loading, obtenerMetrica } = useCustomMetricasEnVivo();

  const handleActualizar = () => {
    obtenerMetrica(tipo, fecha || null);
  };

  const labelFecha = metrica?.TipoRango === 'dia' && metrica?.FechaBalance
    ? new Date(metrica.FechaBalance + 'T00:00:00').toLocaleDateString('es-AR')
    : metrica?.FechaBalance || 'CARGANDO...';

  const labelPeriodo = metrica?.TipoRango
    ? (metrica.TipoRango === 'dia' ? 'Día' : 
        metrica.TipoRango.charAt(0).toUpperCase() + metrica.TipoRango.slice(1))
    : 'Período';

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <h4 className="mt-3">Cargando métricas...</h4>
      </div>
    );
  }

  if (!metrica) {
    return <div className="alert alert-danger">Error al cargar métricas</div>;
  }

  const barData = {
    labels: [labelPeriodo],
    datasets: [
      { label: 'Ingresos', data: [metrica.IngresosCobrados], backgroundColor: '#28a745' },
      { label: 'Egresos', data: [metrica.EgresosPagados], backgroundColor: '#dc3545' }
    ]
  };

  const doughnutData = {
    labels: [metrica.ServicioMasUtilizado || 'N/A', 'Otros'],
    datasets: [{
      data: [
        metrica.VecesServicioTop || 0,
        Math.max(0, (metrica.TurnosAtendidos || 0) - (metrica.VecesServicioTop || 0))
      ],
      backgroundColor: ['#0470BB', '#6c757d']
    }]
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
        <h3>MÉTRICAS - {labelFecha.toUpperCase()}</h3>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setFecha(''); 
            }}
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>

          {tipo === 'dia' && (
            <input
              type="date"
              className="form-control form-control-sm"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          )}

          {tipo === 'semana' && (
            <input
              type="week"
              className="form-control form-control-sm"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          )}

          {tipo === 'mes' && (
            <input
              type="month"
              className="form-control form-control-sm"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          )}

          <button className="btn btn-light btn-sm" onClick={handleActualizar}>
            Actualizar
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="metric-card bg-success text-white">
              <h5>GANANCIA NETA</h5>
              <h2>${metrica.BalanceDelDia.toFixed(2)}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card bg-info text-white">
              <h5>EMPLEADO TOP</h5>
              <h4>{metrica.EmpleadoTopHoras}</h4>
              <small>{metrica.HorasEmpleadoTop.toFixed(1)}h</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card bg-primary text-white">
              <h5>SERVICIO ESTRELLA</h5>
              <h4>{metrica.ServicioMasUtilizado}</h4>
              <small>{metrica.VecesServicioTop} veces</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card bg-warning text-dark">
              <h5>TURNOS</h5>
              <h2>{metrica.TurnosAtendidos}</h2>
              <small>de {metrica.TurnosProgramados}</small>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="chart-container p-4 bg-white rounded shadow">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: `Ingresos vs Egresos (${labelPeriodo})` }
                  }
                }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="chart-container p-4 bg-white rounded shadow">
              <Doughnut data={doughnutData} />
              <p className="text-center mt-3 fw-bold">Servicio más usado</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <small className="text-success fw-bold">
            EN VIVO • SIN BASE DE DATOS • 100% ACTUALIZADO
          </small>
        </div>
      </div>
    </div>
  );
};

export default MetricasEnVivo;