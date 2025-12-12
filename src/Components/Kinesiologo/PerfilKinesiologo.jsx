import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../Store/useAuthStore';
import useCustomEmpleados from '../../Custom/Empleados/CustomEmpleados';
import { getTurnosDelDia } from '../../Custom/CustomTurnos';
import '../../Css/Kinesiologo/PerfilKinesiologo.css';

const PerfilKinesiologo = ({ setActiveTab }) => {
  const { user } = useAuthStore();

  // DATOS DEL LOGIN
  const emailLogin = user?.usuario?.MailUsuario;
  const nombreLogin = `${user?.usuario?.NombreKinesiologo || ''} ${user?.usuario?.ApellidoKinesiologo || ''}`.trim().toLowerCase();

  const { empleados, loading } = useCustomEmpleados();
  const [turnosHoy, setTurnosHoy] = useState(0);
  const [turnosSemana, setTurnosSemana] = useState(0);
  const [loadingTurnos, setLoadingTurnos] = useState(true);

  const kine = empleados.find(e => 
    e.MailUsuario?.toLowerCase() === emailLogin?.toLowerCase() || 
    `${e.NombreEmpleado || ''} ${e.ApellidoEmpleado || ''}`.trim().toLowerCase() === nombreLogin
  );

  // Obtener turnos 
  useEffect(() => {
    const cargarTurnos = async () => {
      if (!kine?.idEmpleado) {
        console.log('No hay idEmpleado del kine');
        setLoadingTurnos(false);
        return;
      }
      
      console.log('Cargando turnos para kinesiólogo:', kine.idEmpleado, kine.NombreEmpleado, kine.ApellidoEmpleado);
      setLoadingTurnos(true);
      try {
        // Turnos de hoy
        const hoy = new Date().toISOString().split('T')[0];
        console.log('Consultando turnos de hoy:', hoy);
        const turnosHoyResponse = await getTurnosDelDia(hoy);
        console.log('Respuesta turnos hoy:', turnosHoyResponse);
        
        const todosTurnosHoy = [
          ...(turnosHoyResponse.turnos?.solicitados || []),
          ...(turnosHoyResponse.turnos?.enCurso || []),
          ...(turnosHoyResponse.turnos?.finalizados || [])
        ];
        console.log('Todos los turnos de hoy:', todosTurnosHoy);
        
        
        if (todosTurnosHoy.length > 0) {
          console.log('Campos del primer turno:', Object.keys(todosTurnosHoy[0]));
          console.log('Turno completo:', todosTurnosHoy[0]);
        }
        
        const turnosDelKineHoy = todosTurnosHoy.filter(t => {
         
          const nombreCompletoTurno = `${t.NombreEmpleado || ''} ${t.ApellidoEmpleado || ''}`.trim().toLowerCase();
          const nombreCompletoKine = `${kine.NombreEmpleado} ${kine.ApellidoEmpleado}`.trim().toLowerCase();
          const coincide = nombreCompletoTurno === nombreCompletoKine;
          
          if (coincide) {
            console.log('✓ Turno', t.idTurno, 'es del kine:', nombreCompletoTurno);
          }
          
          return coincide;
        });
        console.log('Turnos del kine hoy:', turnosDelKineHoy.length, turnosDelKineHoy);
        setTurnosHoy(turnosDelKineHoy.length);

       
        const ahora = new Date();
        const diaSemana = ahora.getDay();
        const lunes = new Date(ahora);
        lunes.setDate(ahora.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
        
        let totalTurnosSemana = 0;
        for (let i = 0; i < 7; i++) {
          const fecha = new Date(lunes);
          fecha.setDate(lunes.getDate() + i);
          const fechaStr = fecha.toISOString().split('T')[0];
          
          try {
            const response = await getTurnosDelDia(fechaStr);
            const nombreCompletoKine = `${kine.NombreEmpleado} ${kine.ApellidoEmpleado}`.trim().toLowerCase();
            const turnosDelKine = [
              ...(response.turnos?.solicitados || []),
              ...(response.turnos?.enCurso || []),
              ...(response.turnos?.finalizados || [])
            ].filter(t => {
              const nombreCompletoTurno = `${t.NombreEmpleado || ''} ${t.ApellidoEmpleado || ''}`.trim().toLowerCase();
              return nombreCompletoTurno === nombreCompletoKine;
            });
            totalTurnosSemana += turnosDelKine.length;
          } catch (err) {
            console.error(`Error al cargar turnos del ${fechaStr}:`, err);
          }
        }
        setTurnosSemana(totalTurnosSemana);
      } catch (error) {
        console.error('Error al cargar turnos:', error);
      } finally {
        setLoadingTurnos(false);
      }
    };

    cargarTurnos();
  }, [kine]);

  
  if (loading) {
    return (
      <div className="perfil-kinesiologo-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem' }}></div>
          <p className="mt-4 text-muted fs-5">Cargando tu panel, Dr/a...</p>
        </div>
      </div>
    );
  }

  if (!kine) {
    return (
      <div className="perfil-kinesiologo-container">
        <div className="container-fluid">
          <div className="alert alert-warning text-center p-5">
            <h4>No se encontró tu perfil</h4>
            <small>
              Email: {emailLogin || 'No disponible'}<br/>
              Nombre: {user?.usuario?.NombreKinesiologo} {user?.usuario?.ApellidoKinesiologo}
            </small>
            <p className="mt-3 text-danger">Verificá que estés registrado como empleado</p>
          </div>
        </div>
      </div>
    );
  }

  const nombreKine = `${kine.NombreEmpleado} ${kine.ApellidoEmpleado}`.trim();

  const handleInfoPersonal = () => setActiveTab('perfilInfo');

  const formatearFecha = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="perfil-kinesiologo-container">
    
      <div className="kine-welcome-section kine-fade-in">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <div className="d-flex align-items-center">
                <div 
                  className="kine-avatar rounded-circle d-flex align-items-center justify-content-center me-4"
                  onClick={handleInfoPersonal}
                  role="button"
                  title="Ver información completa"
                >
                  <span className="material-symbols-outlined">health_and_safety</span>
                </div>
                <div>
                  <h1 className="kine-welcome-name">¡Hola, {nombreKine}!</h1>
                  <p className="kine-welcome-subtitle">Panel del Kinesiólogo</p>
                  <small className="kine-welcome-date d-flex align-items-center mt-2">
                    <span className="material-symbols-outlined me-2">calendar_today</span>
                    {formatearFecha()}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-5 text-md-end mt-4 mt-md-0">
              <div className="kine-card-stats">
                {loadingTurnos ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                ) : (
                  <>
                    <div className="kine-stats-number">{turnosSemana}</div>
                    <div className="kine-stats-label">Turnos esta semana</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL PRINCIPAL */}
      <div className="container-fluid">
        <h3 className="section-title mb-5 text-primary fw-bold kine-fade-in">
          <span className="material-symbols-outlined me-3">dashboard</span>
          Mi Panel Profesional
        </h3>

        <div className="kine-nav-cards kine-slide-up">
          <div className="kine-nav-card">
            <div className="kine-card-icon">
              <span className="material-symbols-outlined">today</span>
            </div>
            <h5 className="kine-card-title">Turnos de Hoy</h5>
            <p className="kine-card-description">Pacientes asignados para hoy</p>
            <div className="kine-card-stats">
              {loadingTurnos ? (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <>
                  <div className="kine-stats-number text-primary">{turnosHoy}</div>
                  <div className="kine-stats-label">Hoy</div>
                </>
              )}
            </div>
          </div>

          <div className="kine-nav-card">
            <div className="kine-card-icon" style={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)' }}>
              <span className="material-symbols-outlined">date_range</span>
            </div>
            <h5 className="kine-card-title">Esta Semana</h5>
            <p className="kine-card-description">Turnos programados</p>
            <div className="kine-card-stats">
              {loadingTurnos ? (
                <div className="spinner-border spinner-border-sm text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <>
                  <div className="kine-stats-number text-success">{turnosSemana}</div>
                  <div className="kine-stats-label">Semana</div>
                </>
              )}
            </div>
          </div>

          <div className="kine-nav-card" onClick={handleInfoPersonal} role="button">
            <div className="kine-card-icon" style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)' }}>
              <span className="material-symbols-outlined">badge</span>
            </div>
            <h5 className="kine-card-title">Información Personal</h5>
            <p className="kine-card-description">DNI, matrícula, contacto y más</p>
            <div className="kine-card-stats">
              <span className="material-symbols-outlined text-warning">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilKinesiologo;