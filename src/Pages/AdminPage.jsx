import React, { useState } from "react";
import Pacientes from "../components/Admin/Pacientes/Pacientes";
import Turnos from "../components/Admin/Turnos/Turnos";
import Profesionales from "../components/Admin/Profesionales/Profesionales";
import Tratamientos from "../components/Admin/Tratamientos/Tratamientos";
import Mensajes from "../components/Admin/Mensajes/Mensajes";
import Estadisticas from "../components/Admin/Estadisticas/Estadisticas";
import Configuracion from "../components/Admin/Configuracion/Configuracion";
import Cobros from "../components/Admin/Cobros/Cobros";
import Pagos from "../components/Admin/Pagos/Pagos";
import ObrasSociales from "../components/Admin/ObrasSociales/ObrasSociales";
import Asistencias from "../components/Admin/Asistencias/Asistencias";
import FAQs from "../components/Admin/FAQs/FAQs";

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
    { id: "turnos", label: "Turnos", icon: "calendar_today" },
    { id: "pacientes", label: "Pacientes", icon: "groups" },
    { id: "profesionales", label: "Profesionales", icon: "local_hospital" },
    { id: "tratamientos", label: "Tratamientos", icon: "healing" },
    { id: "cobros", label: "Cobros", icon: "receipt_long" },
    { id: "pagos", label: "Gastos", icon: "credit_card" },
    { id: "obrasSociales", label: "Obras Sociales", icon: "health_and_safety" },
    { id: "asistencias", label: "Asistencias", icon: "assignment_turned_in" },
    { id: "mensajes", label: "Mensajes", icon: "mail" },
    { id: "faqs", label: "FAQs", icon: "help" },
    { id: "estadisticas", label: "Estadísticas", icon: "bar_chart" },
    { id: "config", label: "Configuración", icon: "settings" },
  ];

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#6B6B6B" }}>
      {/* Sidebar */}
      <div
        className="text-white"
        style={{
          width: sidebarCollapsed ? "70px" : "250px",
          transition: "width 0.3s ease",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#0470BB",
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom" style={{ borderColor: "#3AB1CF" }}>
          <div className="d-flex align-items-center justify-content-between">
            {!sidebarCollapsed && (
              <h5 className="mb-0 fw-bold">
                <span className="material-symbols-outlined me-2" style={{ fontSize: "1.8rem" }}>
                  health_and_safety
                </span>
                Fissio Admin
              </h5>
            )}
            <button
              className="btn btn-link text-white p-0"
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
              className={`nav-link text-start border-0 rounded mb-2 p-3 text-white d-flex align-items-center
                ${activeTab === item.id ? "bg-white text-dark fw-bold" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                backgroundColor: activeTab === item.id ? "#ffffff" : "transparent",
                color: activeTab === item.id ? "#0470BB" : "white",
                transition: "all 0.3s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) e.currentTarget.style.backgroundColor = "#3AB1CF";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* Ícono siempre visible */}
              <span className="material-symbols-outlined me-3" style={{ fontSize: "1.4rem" }}>
                {item.icon}
              </span>

              {/* Texto solo si NO está colapsado */}
              {!sidebarCollapsed && <span className="fw-medium">{item.label}</span>}

              {/* Indicador visual cuando está colapsado y activo */}
              {sidebarCollapsed && activeTab === item.id && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: "#ffffff",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="mt-auto p-3 border-top" style={{ borderColor: "#3AB1CF" }}>
            <div className="d-flex align-items-center">
              <div className="bg-white rounded-circle p-2 me-3">
                <span className="material-symbols-outlined" style={{ color: "#0470BB" }}>person</span>
              </div>
              <div>
                <div className="fw-bold text-white">Admin Fissio</div>
                <small style={{ color: "#A7B1B4" }}>admin@fissio.com.ar</small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="bg-white shadow-sm p-4" style={{ borderBottom: "4px solid #0470BB" }}>
          <h4 className="mb-0 fw-bold" style={{ color: "#0470BB" }}>
            {menuItems.find((m) => m.id === activeTab)?.label || "Dashboard"}
          </h4>
          <small style={{ color: "#A7B1B4" }}>
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
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{
                        background: "white",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-2" style={{ color: "#6B6B6B" }}>{stat.title}</h6>
                            <h3 className="fw-bold mb-1" style={{ color: "#0470BB" }}>{stat.value}</h3>
                            <small style={{ color: stat.change.startsWith("+") ? "#3AB1CF" : "#A7B1B4" }}>
                              {stat.change} vs ayer
                            </small>
                          </div>
                          <div
                            className="p-3 rounded-circle"
                            style={{
                              backgroundColor: stat.color + "20",
                              border: `2px solid ${stat.color}`,
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "2.2rem", color: stat.color }}
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
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0" style={{ color: "#0470BB" }}>Próximos Turnos del Día</h5>
                    </div>
                    <div className="card-body text-center py-5">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "5rem", color: "#3AB1CF" }}
                      >
                        calendar_month
                      </span>
                      <p className="text-muted mt-3">Vista completa en la pestaña Turnos</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0" style={{ color: "#0470BB" }}>Acciones Rápidas</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-3">
                        <button
                          className="btn btn-lg text-white"
                          style={{ backgroundColor: "#0470BB" }}
                          onClick={() => setActiveTab("turnos")}
                        >
                          <span className="material-symbols-outlined me-2">add</span>
                          Nuevo Turno
                        </button>
                        <button
                          className="btn btn-outline-primary border-2"
                          style={{ borderColor: "#3AB1CF", color: "#3AB1CF" }}
                          onClick={() => setActiveTab("pacientes")}
                        >
                          <span className="material-symbols-outlined me-2">person_add</span>
                          Nuevo Paciente
                        </button>
                        <button
                          className="btn btn-outline-success border-2"
                          style={{ borderColor: "#0470BB", color: "#0470BB" }}
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
          {activeTab === "tratamientos" && <Tratamientos />}
          {activeTab === "cobros" && <Cobros />}
          {activeTab === "pagos" && <Pagos />}
          {activeTab === "obrasSociales" && <ObrasSociales />}
          {activeTab === "asistencias" && <Asistencias />}
          {activeTab === "mensajes" && <Mensajes />}
          {activeTab === "faqs" && <FAQs />}
          {activeTab === "estadisticas" && <Estadisticas />}
          {activeTab === "config" && <Configuracion />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;