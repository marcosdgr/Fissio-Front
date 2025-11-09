import React, { useState } from "react";
import Pacientes from "../Components/Admin/Pacientes/Pacientes";
import Turnos from "../Components/Admin/Turnos/Turnos";
import Profesionales from "../Components/Admin/Empleados/Profesionales";
import Servicios from "../Components/Admin/Servicios/Servicios";
import Tratamientos from "../Components/Admin/Tratamientos/Tratamientos";
import Estadisticas from "../Components/Admin/Estadisticas/Estadisticas";
import Configuracion from "../Components/Admin/Configuracion/Configuracion";
import Cobros from "../Components/Admin/Cobros/Cobros";
import Pagos from "../Components/Admin/Pagos/Pagos";
import Asistencias from "../Components/Admin/Asistencias/Asistencias";
import HorariosTrabajo from "../Components/Admin/Horarios/HorariosTrabajo";
import FAQs from "../Components/Admin/FAQs/FAQs";
import "../Css/Admin/AdminPage.css";
import ObrasSociales from "../Components/Admin/ObrasSociales/ObrasSociales";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { title: "Pacientes Activos", value: "248", change: "+12%", icon: "person", color: "#0470BB" },
    { title: "Turnos Hoy", value: "18", change: "+5", icon: "event", color: "#3AB1CF" },
    { title: "Ingresos del Día", value: "$12.840", change: "+28%", icon: "payments", color: "#0470BB" },
    { title: "Cobros Pendientes", value: "7", change: "-2", icon: "warning", color: "#A7B1B4" },
  ];

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
    { id: "estadisticas", label: "Estadísticas", icon: "bar_chart" },
    { id: "config", label: "Configuración", icon: "settings" },
  ];

  return (
    <div className="d-flex admin-container">
      {/* Sidebar */}
      <div className={`text-white admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="p-3 sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            {!sidebarCollapsed && (
              <h5 className="mb-0 fw-bold text-white">
                <span className="material-symbols-outlined me-2 fs-1">
                  health_and_safety
                </span>
                Fissio Admin
              </h5>
            )}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <span className="material-symbols-outlined">
                {sidebarCollapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          </div>
        </div>

        {/* Menú */}
        <nav className="nav flex-column p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start rounded mb-2 p-3 d-flex align-items-center sidebar-nav-item
                ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {/* Ícono siempre visible */}
              <span className="material-symbols-outlined me-3 fs-4">
                {item.icon}
              </span>

              {/* Texto solo si NO está colapsado */}
              {!sidebarCollapsed && <span className="fw-medium sidebar-text">{item.label}</span>}

              {/* Indicador visual cuando está colapsado y activo */}
              {sidebarCollapsed && activeTab === item.id && (
                <div className="sidebar-collapsed-indicator" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
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
        <div className="admin-header shadow-sm p-4">
          <h4 className="mb-0 fw-bold">
            {menuItems.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h4>
          <small>
            Panel de administración • {new Date().toLocaleDateString("es-AR")}
          </small>
        </div>

        <div className="p-4">
          {/* Dashboard */}
          {activeTab === "overview" && (
            <>
              <div className="row mb-4 g-4">
                {stats.map((stat, i) => (
                  <div key={i} className="col-lg-3 col-md-6">
                    <div className="card h-100 shadow-sm stats-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-2 stats-title">{stat.title}</h6>
                            <h3 className="fw-bold mb-1 stats-value">{stat.value}</h3>
                            <small className={stat.change.startsWith("+") ? "stats-change-positive" : "stats-change-negative"}>
                              {stat.change} vs ayer
                            </small>
                          </div>
                          <div
                            className="p-3 stats-icon-container"
                            style={{
                              backgroundColor: stat.color + "20",
                              borderColor: stat.color,
                            }}
                          >
                            <span
                              className="material-symbols-outlined fs-1"
                              style={{ color: stat.color }}
                            >
                              {stat.icon}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card shadow-sm border-0">
                    <div className="card-header dashboard-card-header">
                      <h5 className="mb-0">Próximos Turnos del Día</h5>
                    </div>
                    <div className="card-body text-center py-5">
                      <span className="material-symbols-outlined dashboard-icon-large">
                        calendar_month
                      </span>
                      <p className="text-muted mt-3">Vista completa en la pestaña Turnos</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header dashboard-card-header">
                      <h5 className="mb-0">Acciones Rápidas</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-3">
                        <button
                          className="btn btn-lg btn-fissio-primary"
                          onClick={() => setActiveTab("turnos")}
                        >
                          <span className="material-symbols-outlined me-2">add</span>
                          Nuevo Turno
                        </button>
                        <button
                          className="btn btn-fissio-secondary"
                          onClick={() => setActiveTab("pacientes")}
                        >
                          <span className="material-symbols-outlined me-2">person_add</span>
                          Nuevo Paciente
                        </button>
                        <button
                          className="btn btn-fissio-outline"
                          onClick={() => setActiveTab("cobros")}
                        >
                          <span className="material-symbols-outlined me-2">payments</span>
                          Registrar Cobro
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pestañas */}
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
          {activeTab === "estadisticas" && <Estadisticas />}
          {activeTab === "config" && <Configuracion />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;