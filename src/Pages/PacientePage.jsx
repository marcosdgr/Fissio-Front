import React, { useState, useEffect } from 'react'
import Perfil from '../Components/Paciente/Perfil/Perfil'
import PerfilInfo from '../Components/Paciente/Perfil/PerfilInfo'
import HistorialTurnos from '../Components/Paciente/Turnos/HistorialTurnos'
import AgendarTurnoForm from '../Components/Paciente/Turnos/AgendarTurnoForm'
import Comentarios from "../Components/Paciente/Comentarios/ComentariosDelPaciente"
import Configuracion from '../Components/Paciente/Configuracion/Configuracion'
import { obtenerPacientePorId, obtenerEmailPacientePorId  } from '../Custom/Paciente/CustomPacienteVista'
import { useAuthStore } from '../Store/useAuthStore'
import '../Css/Paciente/PacientePage.css'

const PacientePage = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [pacienteData, setPacienteData] = useState(null)
  const [emailPaciente, setEmailPaciente] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const idPaciente = user?.idPaciente || user?.usuario?.idPaciente || user?.idUsuario

  // Cargar datos del paciente logueado
  useEffect(() => {
    const cargarDatosPaciente = async () => {
      if (!idPaciente) {
        setLoading(false)
        return
      }

      try {
        // Obtener datos del paciente
        const data = await obtenerPacientePorId(idPaciente)
        setPacienteData(data)
        
        // Obtener email del paciente
        const emailData = await obtenerEmailPacientePorId(idPaciente)
        setEmailPaciente(emailData.MailUsuario)
      } catch (error) {
        console.error('Error al cargar datos del paciente:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatosPaciente()
  }, [idPaciente, user])

  const menuItems = [
    { id: "perfil", label: "Mi Perfil", icon: "account_circle" },
    { id: "comentarios", label: "Comentarios", icon: "comment" },
    { id: "historial", label: "Historial", icon: "history" },
    { id: "agendar", label: "Agendar Turno", icon: "add_circle" },
    { id: "config", label: "Configuración", icon: "settings" },
  ];

  return (
    <div className="d-flex paciente-container">
      {/* Sidebar fijo */}
      <div className="text-white paciente-sidebar">
        {/* Header */}
        <div className="p-3 sidebar-header">
          <div className="d-flex align-items-center justify-content-center">
            <h5 className="mb-0 fw-bold text-white">
              <p></p>
              <span className="material-symbols-outlined me-2 fs-1">
                favorite
              </span>
              {loading ? 'Fissio' : `Hola, ${pacienteData?.NombrePaciente || 'Paciente'}`}
            </h5>
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
              <span className="material-symbols-outlined me-3 fs-4">
                {item.icon}
              </span>
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
              {loading ? (
                <div className="fw-bold text-white">Cargando...</div>
              ) : (
                <>
                  <div className="fw-bold text-white">
                    {pacienteData ? `${pacienteData.NombrePaciente} ${pacienteData.ApellidoPaciente}` : 'Paciente'}
                  </div>
                  <small className="sidebar-user-email">
                    {emailPaciente || 'paciente@fissio.com'}
                  </small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1 paciente-main-content">
        <div className="paciente-header shadow-sm p-4">
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
          {activeTab === "comentarios" && <Comentarios />}
          {activeTab === "historial" && <HistorialTurnos />}
          {activeTab === "agendar" && <AgendarTurnoForm setActiveTab={setActiveTab} />}
          {activeTab === "config" && <Configuracion />}
        </div>
      </div>
    </div>
  );
};

export default PacientePage;