import React, { useState } from "react";
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
import Metricas from "../Components/Admin/Metricas/Metricas"; 
import "../Css/Admin/AdminPage.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("metricas");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const menuItems = [
    { id: "metricas", label: "Métricas", icon: "trending_up" },
    { id: "horarios", label: "Horarios", icon: "schedule" },
    { id: "turnos", label: "Turnos", icon: "calendar_today" },
    { id: "pacientes", label: "Pacientes", icon: "groups" },
    { id: "profesionales", label: "Empleados", icon: "local_hospital" },
    { id: "servicios", label: "Servicios", icon: "medical_services" },
    { id: "tratamientos", label: "Tratamientos", icon: "healing" },
    { id: "cobros", label: "Cobros", icon: "receipt_long" },
    { id: "pagos", label: "Gastos", icon: "credit_card" },
    { id: "obrasSociales", label: "Obras Sociales", icon: "health_and_safety" },
    { id: "asistencias", label: "Asistencias", icon: "assignment_turned_in" },
    { id: "faqs", label: "FAQs", icon: "help" },
    { id: "feedback", label: "Feedback", icon: "feedback" },
  ];

  return (
    <div className="admin-container">
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Botón hamburguesa para móviles */}
      <button 
        className="sidebar-toggle-mobile" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined">
          {sidebarOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar */}
      <div className={`text-white admin-sidebar position-fixed ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-3 sidebar-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold text-white d-flex align-items-center">
            Panel Administrador
          </h5>
        </div>

        <nav className="nav flex-column p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start rounded mb-2 p-3 d-flex align-items-center sidebar-nav-item
                ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="material-symbols-outlined me-3 fs-4 sidebar-icon">{item.icon}</span>
              <span className="fw-medium sidebar-text">{item.label}</span>
            </button>
          ))}
        </nav>

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