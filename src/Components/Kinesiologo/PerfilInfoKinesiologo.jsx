import React from 'react';
import { useAuthStore } from '../../Store/useAuthStore';
import useCustomEmpleados from '../../Custom/Empleados/CustomEmpleados';
import '../../Css/Kinesiologo/PerfilKinesiologo.css';

const PerfilInfoKinesiologo = ({ setActiveTab }) => {
  const { user } = useAuthStore();

  const emailLogin = user?.usuario?.MailUsuario;
  const nombreLogin = `${user?.usuario?.NombreKinesiologo || ''} ${user?.usuario?.ApellidoKinesiologo || ''}`.trim().toLowerCase();

  const { empleados, loading } = useCustomEmpleados();

  const kine = empleados.find(e => 
    e.MailUsuario?.toLowerCase() === emailLogin?.toLowerCase() || 
    `${e.NombreEmpleado || ''} ${e.ApellidoEmpleado || ''}`.trim().toLowerCase() === nombreLogin
  );

  if (loading) {
    return (
      <div className="perfil-kinesiologo-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem' }}></div>
          <p className="mt-4 text-muted fs-5">Cargando información profesional...</p>
        </div>
      </div>
    );
  }

  if (!kine) {
    return (
      <div className="perfil-kinesiologo-container">
        <div className="container-fluid">
          <div className="alert alert-danger text-center p-5">
            <h4>Perfil no encontrado</h4>
            <p>Contactá al administrador para registrarte como empleado</p>
          </div>
        </div>
      </div>
    );
  }

  const handleVolver = () => setActiveTab('perfil');

  return (
    <div className="perfil-kinesiologo-container">
      {/* BOTÓN VOLVER */}
      <div className="container-fluid mb-4">
        <button className="kine-btn-volver d-flex align-items-center" onClick={handleVolver}>
          <span className="material-symbols-outlined me-2">arrow_back</span>
          Volver al Panel
        </button>
      </div>

      {/* HEADER */}
      <div className="kine-welcome-section kine-fade-in">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="kine-avatar rounded-circle d-flex align-items-center justify-content-center me-4">
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
            <div>
              <h1 className="kine-welcome-name">Información Profesional</h1>
              <p className="kine-welcome-subtitle">
                {kine.NombreEmpleado} {kine.ApellidoEmpleado}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DATOS */}
      <div className="container-fluid mt-5">
        <div className="row g-4">
          {/* DATOS PERSONALES */}
          <div className="col-xl-6">
            <div className="kine-nav-card h-100">
              <div className="kine-card-icon">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h5 className="kine-card-title">Datos Personales</h5>
              <div className="kine-card-description mt-4">
                <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                  <span className="fw-bold text-muted">Nombre completo:</span>
                  <span className="text-dark">{kine.NombreEmpleado} {kine.ApellidoEmpleado}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                  <span className="fw-bold text-muted">DNI:</span>
                  <span>{kine.DNI || 'No registrado'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold text-muted">Email:</span>
                  <span>{kine.MailUsuario || 'No registrado'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DATOS PROFESIONALES */}
          <div className="col-xl-6">
            <div className="kine-nav-card h-100">
              <div className="kine-card-icon" style={{ background: 'linear-gradient(135deg, #9C27B0, #E91E63)' }}>
                <span className="material-symbols-outlined">work</span>
              </div>
              <h5 className="kine-card-title">Datos Profesionales</h5>
              <div className="kine-card-description mt-4">
                <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                  <span className="fw-bold text-muted">Matrícula:</span>
                  <span className="text-dark">{kine.Matricula || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
                  <span className="fw-bold text-muted">Categoría:</span>
                  <span>{kine.NombreCat || 'Kinesiólogo'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold text-muted">Teléfono:</span>
                  <span>{kine.TelefonoEmpleado || 'No registrado'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilInfoKinesiologo;