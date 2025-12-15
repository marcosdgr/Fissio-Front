import React, { useState } from 'react';
import MensajeriaInterna from '../Components/MensajeriaInterna/MensajeriaInterna';
import PerfilKinesiologo from '../Components/Kinesiologo/PerfilKinesiologo';
import PerfilInfoKinesiologo from '../Components/Kinesiologo/PerfilInfoKinesiologo';
import TurnosKinesiologo from '../Components/Kinesiologo/TurnosKinesiologo';
import AsistenciaEmpleado from '../Components/Asistencia/AsistenciaEmpleado';
import '../Css/Kinesiologo/KinesiologoPage.css';

const KinesiologoPage = () => {
  const [activeTab, setActiveTab] = useState("mensajes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "perfil", label: "Mi Perfil", icon: "person" },
    { id: "turnos", label: "Mis Turnos", icon: "event" },
    { id: "asistencia", label: "Mi Asistencia", icon: "access_time" },
    { id: "mensajes", label: "Mensajes", icon: "mail" },
    { id: "perfilInfo", label: "Info Personal", icon: "badge" },
  ];

  return (
    <div className={`d-flex kinesiologo-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay show" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`kinesiologo-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="p-3 sidebar-header">
          <h5 className="mb-0 fw-bold text-white">
            <span className="material-symbols-outlined me-2">health_and_safety</span>
            Panel Profesional
          </h5>
        </div>
        <nav className="nav flex-column p-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-link sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="material-symbols-outlined me-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido */}
      <div className="flex-grow-1 kinesiologo-main-content">
        <div className="kinesiologo-header p-4">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">
              {sidebarOpen ? 'close' : 'menu'}
            </span>
          </button>
          <h4 className="mb-0 fw-bold">
            {menuItems.find(m => m.id === activeTab)?.label || "Panel"}
          </h4>
        </div>
        <div className="p-4">
          {activeTab === "perfil" && <PerfilKinesiologo setActiveTab={setActiveTab} />}
          {activeTab === "turnos" && <TurnosKinesiologo />}
          {activeTab === "asistencia" && <AsistenciaEmpleado />}
          {activeTab === "mensajes" && <MensajeriaInterna />}
          {activeTab === "perfilInfo" && <PerfilInfoKinesiologo setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
};

export default KinesiologoPage;