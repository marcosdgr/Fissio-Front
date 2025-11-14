import React, { useState } from "react";
import useDashboardData from "../Custom/useDashboardData";
import useCustomMetricas from "../Custom/useCustomMetricas"; // ← NUEVO NOMBRE
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import Pacientes from "../Components/Admin/Pacientes/Pacientes";
import Turnos from "../Components/Admin/Turnos/Turnos";
import Profesionales from "../Components/Admin/Empleados/Profesionales";
import Servicios from "../Components/Admin/Servicios/Servicios";
import Tratamientos from "../Components/Admin/Tratamientos/Tratamientos";
import Configuracion from "../Components/Admin/Configuracion/Configuracion";
import Cobros from "../Components/Admin/Cobros/Cobros";
import Pagos from "../Components/Admin/Pagos/Pagos";
import Asistencias from "../Components/Admin/Asistencias/Asistencias";
import HorariosTrabajo from "../Components/Admin/Horarios/HorariosTrabajo";
import FAQs from "../Components/Admin/FAQs/FAQs";
import ObrasSociales from "../Components/Admin/ObrasSociales/ObrasSociales";
import FeedbakAdmin from "../Components/Admin/Feedback/FeedbakAdmin";
import Metricas from "../Components/Admin/Metricas/Metricas"; // ← NUEVO COMPONENTE
import "../Css/Admin/AdminPage.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data, loading, error } = useDashboardData();
  const { metrica, loading: loadingMetrica, obtenerMetrica } = useCustomMetricas(); // ← CORREGIDO

  // === CÁLCULOS RÁPIDOS ===
  const hoy = new Date().toISOString().split('T')[0];
  const ingresosHoy = data.cobros
    .filter(c => c.fechaCobro?.split('T')[0] === hoy && c.estado === 'pagado')
    .reduce((sum, c) => sum + (c.monto || 0), 0);

  const cobrosPendientes = data.cobros.filter(c => c.estado === 'pendiente').length;
  const pacientesActivos = data.pacientes.filter(p => p.IsActive).length;
  const profesionalesActivos = data.profesionales.filter(p => p.IsActive).length;

  // === GRÁFICOS ===
  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const ingresosPorDia = ultimos7Dias.map(fecha => {
    return data.cobros
      .filter(c => c.fechaCobro?.split('T')[0] === fecha && c.estado === 'pagado')
      .reduce((sum, c) => sum + (c.monto || 0), 0);
  });

  const barData = {
    labels: ultimos7Dias.map(d => new Date(d).toLocaleDateString('es-AR', { weekday: 'short' })),
    datasets: [{ label: 'Ingresos', data: ingresosPorDia, backgroundColor: '#0470BB' }]
  };

  const pieData = {
    labels: ['Cobrados Hoy', 'Pendientes'],
    datasets: [{
      data: [
        ingresosHoy,
        data.cobros.filter(c => c.estado === 'pendiente').reduce((s, c) => s + c.monto, 0)
      ],
      backgroundColor: ['#28a745', '#ffc107'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // === MÉTRICAS EN VIVO (Doughnut) ===
  const doughnutData = metrica ? {
    labels: [metrica.ServicioMasUtilizado || 'N/A', 'Otros servicios'],
    datasets: [{
      data: [
        metrica.VecesServicioTop || 0,
        (metrica.TurnosAtendidos || 0) - (metrica.VecesServicioTop || 0)
      ],
      backgroundColor: ['#0470BB', '#6c757d'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  } : null;

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "dashboard" },
    { id: "horarios", label: "Horarios", icon: "schedule" },
    { id: "turnos", label: "Turnos", icon: "calendar_today" },
    { id: "pacientes", label: "Pacientes", icon: "groups" },
    { id: "profesionales", label: "Profesionales", icon: "local_hospital" },
    { id: "servicios", label: "Servicios", icon: "medical_services" },
    { id: "tratamientos", label: "Tratamientos", icon: "healing" },
    { id: "cobros", label: "Cobros", icon: "receipt_long" },
    { id: "pagos", label: "Gastos", icon: "credit_card" },
    { id: "obrasSociales", label: "Obras Sociales", icon: "health_and_safety" },
    { id: "asistencias", label: "Asistencias", icon: "assignment_turned_in" },
    { id: "faqs", label: "FAQs", icon: "help" },
    { id: "feedback", label: "Feedback", icon: "feedback" },
    { id: "metricas", label: "Métricas en Vivo", icon: "trending_up" },
    { id: "config", label: "Configuración", icon: "settings" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className={`text-white admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} position-fixed`}>
        <div className="p-3 sidebar-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {!sidebarCollapsed && (
              <h5 className="mb-0 fw-bold text-white d-flex align-items-center">
                <span className="material-symbols-outlined me-2 fs-1">health_and_safety</span>
                Fissio Admin
              </h5>
            )}
          </div>
          <button
            className="sidebar-toggle btn btn-link text-white p-0 d-flex align-items-center justify-content-center rounded-circle shadow-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span className="material-symbols-outlined fs-3">
              {sidebarCollapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        <nav className="nav flex-column p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start rounded mb-2 p-3 d-flex align-items-center sidebar-nav-item
                ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="material-symbols-outlined me-3 fs-4">{item.icon}</span>
              {!sidebarCollapsed && <span className="fw-medium sidebar-text">{item.label}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="mt-auto p-3 sidebar-footer">
            <div className="d-flex align-items-center">
              <div className="sidebar-user-avatar rounded-circle p-2 me-3">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <div className="fw-bold text-white">Admin Fissio</div>
                <small className="sidebar-user-email">admin@fissio.com.ar</small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1 admin-main-content">
        <div className="admin-header shadow-sm p-4 bg-white">
          <h4 className="mb-0 fw-bold text-primary">
            {menuItems.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h4>
          <small className="text-muted">
            {new Date().toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </small>
        </div>

        <div className="p-4">
          {/* DASHBOARD */}
          {activeTab === "overview" && (
            <>
              {loading || loadingMetrica ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}></div>
                  <h4 className="mt-4">Cargando dashboard en vivo...</h4>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <>
                  {/* ESTADÍSTICAS EN VIVO */}
                  <div className="row g-4 mb-5">
                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-lg h-100 stats-card bg-gradient-success text-white">
                        <div className="card-body p-4">
                          <h6 className="opacity-75">GANANCIA NETA HOY</h6>
                          <h2 className="fw-bold">${metrica?.BalanceDelDia?.toFixed(2) || '0.00'}</h2>
                          <small>EN VIVO</small>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-lg h-100 stats-card bg-gradient-info text-white">
                        <div className="card-body p-4">
                          <h6 className="opacity-75">EMPLEADO ESTRELLA</h6>
                          <h5 className="fw-bold">{metrica?.EmpleadoTopHoras || 'Sin datos'}</h5>
                          <small>{metrica?.HorasEmpleadoTop?.toFixed(1) || '0'}h trabajadas</small>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-lg h-100 stats-card bg-gradient-primary text-white">
                        <div className="card-body p-4">
                          <h6 className="opacity-75">SERVICIO TOP</h6>
                          <h5 className="fw-bold">{metrica?.ServicioMasUtilizado || 'N/A'}</h5>
                          <small>{metrica?.VecesServicioTop || 0} veces hoy</small>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-lg h-100 stats-card bg-gradient-warning text-dark">
                        <div className="card-body p-4">
                          <h6>TURNOS HOY</h6>
                          <h2 className="fw-bold">{metrica?.TurnosAtendidos || 0}</h2>
                          <small>de {metrica?.TurnosProgramados || 0} programados</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GRÁFICOS */}
                  <div className="row g-4">
                    <div className="col-lg-4">
                      <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0">Ingresos vs Pendientes</h5>
                        </div>
                        <div className="card-body">
                          <Pie data={pieData} options={{ responsive: true }} />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card shadow-lg border-0">
                        <div className="card-header bg-success text-white">
                          <h5 className="mb-0">Servicio Dominante Hoy</h5>
                        </div>
                        <div className="card-body">
                          {doughnutData ? <Doughnut data={doughnutData} /> : <p className="text-center">Cargando...</p>}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card shadow-lg border-0">
                        <div className="card-header bg-info text-white">
                          <h5 className="mb-0">Ingresos Últimos 7 Días</h5>
                        </div>
                        <div className="card-body">
                          <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTÓN ACTUALIZAR */}
                  <div className="text-center mt-5">
                    <button
                      className="btn btn-lg btn-primary shadow-lg px-5"
                      onClick={() => obtenerMetrica()}
                    >
                      <span className="material-symbols-outlined me-2">refresh</span>
                      Actualizar Métricas en Vivo
                    </button>
                    <p className="mt-3 text-success fw-bold">
                      SIN BASE DE DATOS • 100% EN TIEMPO REAL • ACTUALIZADO AL SEGUNDO
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* PESTAÑAS */}
          {activeTab === "turnos" && <Turnos />}
          {activeTab === "pacientes" && <Pacientes />}
          {activeTab === "profesionales" && <Profesionales />}
          {activeTab === "servicios" && <Servicios />}
          {activeTab === "tratamientos" && <Tratamientos />}
          {activeTab === "cobros" && <Cobros />}
          {activeTab === "pagos" && <Pagos />}
          {activeTab === "obrasSociales" && <ObrasSociales />}
          {activeTab === "asistencias" && <Asistencias />}
          {activeTab === "horarios" && <HorariosTrabajo />}
          {activeTab === "faqs" && <FAQs />}
          {activeTab === "feedback" && <FeedbakAdmin />}
          {activeTab === "metricas" && <Metricas />}
          {activeTab === "config" && <Configuracion />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;