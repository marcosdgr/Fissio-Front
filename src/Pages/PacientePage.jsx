import React, { useState } from 'react'
import Perfil from '../Components/Paciente/Perfil/Perfil'
import PerfilInfo from '../Components/Paciente/Perfil/PerfilInfo'
import HistorialTurnos from '../Components/Paciente/Turnos/HistorialTurnos'
import AgendarTurnoForm from '../Components/Paciente/Turnos/AgendarTurnoForm'
import Turnos from '../Components/Paciente/Turnos/Turnos'
import Configuracion from '../Components/Paciente/Configuracion/Configuracion'
import '../Css/Paciente/PacientePage.css'

const PacientePage = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "perfil", label: "Mi Perfil", icon: "account_circle" },
    { id: "turnos", label: "Próximos Turnos", icon: "event_available" },
    { id: "historial", label: "Historial", icon: "history" },
    { id: "agendar", label: "Agendar Turno", icon: "add_circle" },
    { id: "config", label: "Configuración", icon: "settings" },
  ];

  return (
    <div className="d-flex paciente-container">
      {/* Overlay para móvil */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'show' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`text-white paciente-sidebar ${mobileMenuOpen ? 'show' : ''}`}>
        {/* Header */}
        <div className="p-3 sidebar-header">
          <h5 className="mb-0 fw-bold text-white">
            <span className="material-symbols-outlined me-2 fs-1">
              favorite
            </span>
            Fissio Paciente
          </h5>
        </div>

        {/* Menú */}
        <nav className="nav flex-column p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start rounded mb-2 p-3 d-flex align-items-center sidebar-nav-item
                ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false); // Cerrar menú móvil al seleccionar
              }}
            >
              {/* Ícono siempre visible */}
              <span className="material-symbols-outlined me-3 fs-4">
                {item.icon}
              </span>

              {/* Texto siempre visible */}
              <span className="fw-medium sidebar-text">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-3 sidebar-footer">
          <div className="d-flex align-items-center">
            <div className="paciente-avatar rounded-circle p-2 me-3">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <div className="fw-bold text-white">Matías Bazán</div>
              <small className="sidebar-user-email">Paciente</small>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1 paciente-main-content">
        <div className="paciente-header shadow-sm p-4">
          {/* Botón móvil */}
          <button
            className="mobile-menu-btn d-lg-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <h4 className="mb-0 fw-bold">
            {menuItems.find((m) => m.id === activeTab)?.label || "Panel del Paciente"}
          </h4>
          <small>
            Bienvenido • {new Date().toLocaleDateString("es-AR")}
          </small>
        </div>

        <div className="p-4">
          {activeTab === "perfil" && <Perfil setActiveTab={setActiveTab} />}
          {activeTab === "perfilInfo" && <PerfilInfo setActiveTab={setActiveTab} />}
          {activeTab === "turnos" && <Turnos />}
          {activeTab === "historial" && <HistorialTurnos />}
          {activeTab === "agendar" && <AgendarTurnoForm setActiveTab={setActiveTab} />}
          {activeTab === "config" && <Configuracion />}
        </div>
      </div>
    </div>
  );
};

export default PacientePage;