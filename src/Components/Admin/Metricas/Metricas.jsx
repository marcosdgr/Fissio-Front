// src/Components/Admin/MetricasDiarias/MetricasEnVivo.jsx
import React from "react";
import useCustomMetricasEnVivo from "../../../Custom/useCustomMetricas";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import "../../../Css/Metricas/Metricas.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const MetricasEnVivo = () => {
  const { metrica, loading, obtenerMetrica } = useCustomMetricasEnVivo();

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div><h4>Cargando métricas en vivo...</h4></div>;
  if (!metrica) return <div className="alert alert-danger">Error al cargar métricas</div>;

  const barData = {
    labels: ['Hoy'],
    datasets: [
      { label: 'Ingresos', data: [metrica.IngresosCobrados], backgroundColor: '#28a745' },
      { label: 'Egresos', data: [metrica.EgresosPagados], backgroundColor: '#dc3545' }
    ]
  };

  const doughnutData = {
    labels: [metrica.ServicioMasUtilizado || 'N/A', 'Otros'],
    datasets: [{
      data: [metrica.VecesServicioTop, metrica.TurnosAtendidos - metrica.VecesServicioTop],
      backgroundColor: ['#0470BB', '#6c757d']
    }]
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white d-flex justify-content-between">
        <h3>MÉTRICAS EN VIVO - {new Date(metrica.FechaBalance).toLocaleDateString('es-AR')}</h3>
        <button className="btn btn-light" onClick={() => obtenerMetrica()}>
          Actualizar Ahora
        </button>
      </div>
      <div className="card-body">
        <div className="row g-4 mb-4">
          <div className="col-md-3"><div className="p-4 bg-success text-white rounded text-center"><h5>GANANCIA NETA</h5><h2>${metrica.BalanceDelDia.toFixed(2)}</h2></div></div>
          <div className="col-md-3"><div className="p-4 bg-info text-white rounded text-center"><h5>EMPLEADO TOP</h5><h4>{metrica.EmpleadoTopHoras}</h4><small>{metrica.HorasEmpleadoTop.toFixed(1)}h</small></div></div>
          <div className="col-md-3"><div className="p-4 bg-primary text-white rounded text-center"><h5>SERVICIO ESTRELLA</h5><h4>{metrica.ServicioMasUtilizado}</h4><small>{metrica.VecesServicioTop} veces</small></div></div>
          <div className="col-md-3"><div className="p-4 bg-warning text-dark rounded text-center"><h5>TURNOS HOY</h5><h2>{metrica.TurnosAtendidos}</h2><small>de {metrica.TurnosProgramados}</small></div></div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="chart-container p-4 bg-white rounded shadow">
              <Bar data={barData} options={{ responsive: true, plugins: { title: { display: true, text: 'Ingresos vs Egresos (HOY)' }}}} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="chart-container p-4 bg-white rounded shadow">
              <Doughnut data={doughnutData} />
              <p className="text-center mt-3 fw-bold">Dominio del servicio top</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <small className="text-success fw-bold">EN VIVO • SIN BASE DE DATOS • 100% ACTUALIZADO</small>
        </div>
      </div>
    </div>
  );
};

export default MetricasEnVivo;