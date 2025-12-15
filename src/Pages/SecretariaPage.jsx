import React, { useState } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import Turnos from '../Components/Admin/Turnos/Turnos';
import AsistenciasSecretaria from '../Components/Secretaria/AsistenciasSecretaria';
import ConfiguracionSecretaria from '../Components/Secretaria/ConfiguracionSecretaria';
import '../Css/Secretaria/SecretariaPage.css';
import '../Css/Secretaria/SidebarSecretaria.css';
import MensajeriaInterna from '../Components/MensajeriaInterna/MensajeriaInterna';
import Cobros from '../Components/Admin/Cobros/Cobros'
import Pacientes from '../Components/Admin/Pacientes/Pacientes';

const SecretariaPage = () => {
  const [activeTab, setActiveTab] = useState("turnos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const menuItems = [
    { id: "pacientes", label: "Pacientes", icon: "people" },
    { id: "turnos", label: "Turnos", icon: "event" },
    { id: "mensajes", label: "Mensajes", icon: "mail" },
    { id: "asistencias", label: "Asistencias", icon: "fact_check" },
    { id:"cobros", label: "Cobros", icon: "payment" },
    { id: "config", label: "Configuración", icon: "settings" }
  ];

  return (
    <div className={`d-flex secretaria-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay show" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar fijo */}
      <div className={`text-white secretaria-sidebar ${sidebarOpen ? 'show' : ''}`}>
        {/* Header */}
        <div className="p-3 sidebar-header">
          <div className="d-flex align-items-center justify-content-center">
            <h5 className="mb-0 fw-bold text-white">
              Panel Administrativo
            </h5>
          </div>
        </div>

        {/* Contenedor scrolleable para el menú y footer */}
        <div className="sidebar-scroll-container">
          {/* Menú */}
          <nav className="nav flex-column">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link text-start rounded mb-2 p-3 d-flex align-items-center sidebar-nav-item
                  ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span className="material-symbols-outlined me-3 fs-4">
                  {item.icon}
                </span>
                <span className="fw-medium sidebar-text">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 sidebar-footer">
            <div className="d-flex align-items-center">
              <div className="secretaria-avatar rounded-circle p-2 me-3">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <div className="fw-bold text-white">
                  {user?.NombreEmpleado || user?.usuario?.NombreEmpleado || 'Secretaria'} {user?.ApellidoEmpleado || user?.usuario?.ApellidoEmpleado || ''}
                </div>
                <small className="sidebar-user-email">
                  {user?.MailUsuario || user?.usuario?.MailUsuario || user?.email || 'secretaria@fissio.com'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1 secretaria-main-content">
        <div className="secretaria-header shadow-sm p-4">
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
            {menuItems.find((m) => m.id === activeTab)?.label || "Panel de Secretaria"}
          </h4>
          <small>
            Bienvenida • {new Date().toLocaleDateString("es-AR")}
          </small>
        </div>

        <div className="p-4">
          {activeTab === "pacientes" && <Pacientes />}
          {activeTab === "turnos" && <Turnos />}
          {activeTab === "mensajes" && <MensajeriaInterna />}
          {activeTab === "asistencias" && <AsistenciasSecretaria />}
          {activeTab === "cobros" && <Cobros />}
          {activeTab === "config" && <ConfiguracionSecretaria />}
        </div>
      </div>
    </div>
  );
};

export default SecretariaPage;
