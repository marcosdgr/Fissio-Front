/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {  turnosKinesiologoDelDia } from '../../Custom/CustomTurnos';
import { showError } from '../../Utils/sweetAlerts';
import { useAuthStore } from '../../Store/useAuthStore';
import useCustomEmpleados from '../../Custom/Empleados/CustomEmpleados';
import FinalizarTurnoModal from '../Admin/Turnos/FinalizarTurnoModal';
import DetallesTurnoModal from '../Admin/Turnos/DetallesTurnoModal';
import '../../Css/Admin/Turnos.css';

const TurnosKinesiologo = () => {
  const { user } = useAuthStore();
  const { empleados, loading: loadingEmpleados } = useCustomEmpleados();
  const [todosTurnos, setTodosTurnos] = useState([]); // Todos los turnos sin filtrar
  const [turnosFiltrados, setTurnosFiltrados] = useState([]);
  
  const [vistaSeleccionada, setVistaSeleccionada] = useState('dia'); // 'dia', 'semana', 'mes'
  const [fechaConsulta, setFechaConsulta] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato para 'dia'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Encontrar el empleado actual
  const emailLogin = user?.usuario?.MailUsuario;
  const nombreLogin = `${user?.usuario?.NombreKinesiologo || user?.usuario?.NombreEmpleado || ''} ${user?.usuario?.ApellidoKinesiologo || user?.usuario?.ApellidoEmpleado || ''}`.trim().toLowerCase();

  const empleadoActual = empleados.find(e => 
    e.MailUsuario?.toLowerCase() === emailLogin?.toLowerCase() || 
    `${e.NombreEmpleado || ''} ${e.ApellidoEmpleado || ''}`.trim().toLowerCase() === nombreLogin
  );
  const [modalFinalizarData, setModalFinalizarData] = useState({
    isOpen: false,
    turno: null
  });
  const [modalDetallesData, setModalDetallesData] = useState({
    isOpen: false,
    turno: null
  });

  const obtenerRangoFechas = (vista, fechaBase = new Date()) => {
    const fecha = new Date(fechaBase);
    let fechaInicio, fechaFin;

    switch(vista) {
      case 'dia':
        fechaInicio = fechaFin = fecha.toISOString().split('T')[0];
        break;
      
      case 'mes': {
        const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        
        const formatearFechaLocal = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        fechaInicio = formatearFechaLocal(primerDia);
        fechaFin = formatearFechaLocal(ultimoDia);
        break;
      }
      
      default:
        fechaInicio = fechaFin = fecha.toISOString().split('T')[0];
    }

    return { fechaInicio, fechaFin };
  };

  const cargarTurnos = async () => {
    if (!empleadoActual?.idEmpleado) {
      return; // Esperar a que se cargue el empleado
    }

    setIsLoading(true);
    try {
      const response = await turnosKinesiologoDelDia(empleadoActual.idEmpleado);
      
      if (response && response.turnos) {
        setTodosTurnos(response.turnos);
        
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      showError('Error', error.response?.data?.message || 'No se pudieron cargar los turnos');
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarTurnosPorFecha = () => {
    if (!todosTurnos || todosTurnos.length === 0) {
      setTurnosFiltrados([]);
      return;
    }

    const fechaBase = new Date(fechaConsulta + 'T12:00:00');
    const { fechaInicio, fechaFin } = obtenerRangoFechas(vistaSeleccionada, fechaBase);
    
    const turnosFiltradosTemp = todosTurnos.filter(turno => {
      const fechaTurno = turno.FechaRequeridaTurno.split('T')[0];
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });
    
    setTurnosFiltrados(turnosFiltradosTemp);
  };

  useEffect(() => {
    if (empleadoActual?.idEmpleado && !loadingEmpleados) {
      cargarTurnos();
    }
  }, [empleadoActual?.idEmpleado, loadingEmpleados]);

  useEffect(() => {
    filtrarTurnosPorFecha();
  }, [todosTurnos, fechaConsulta, vistaSeleccionada]);

  useEffect(() => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    
    if (vistaSeleccionada === 'dia') {
      setFechaConsulta(`${year}-${month}-${day}`);
    } else if (vistaSeleccionada === 'mes') {
      // Para mes, guardar el primer día del mes actual
      setFechaConsulta(`${year}-${month}-01`);
    }
  }, [vistaSeleccionada]);

  const handleFechaChange = (e) => {
    const valorInput = e.target.value;
    
    if (vistaSeleccionada === 'mes' && valorInput) {
      // Convertir YYYY-MM a YYYY-MM-01
      setFechaConsulta(`${valorInput}-01`);
    } else {
      // Para día, ya viene en formato correcto YYYY-MM-DD
      setFechaConsulta(valorInput);
    }
  };

  const obtenerValorInput = () => {
    if (!fechaConsulta) return '';
    
    if (vistaSeleccionada === 'mes') {
      // Convertir YYYY-MM-DD a YYYY-MM para el input type="month"
      return fechaConsulta.substring(0, 7);
    }
    // Para día, devolver fecha completa
    return fechaConsulta;
  };

  const handleVistaChange = (vista) => {
    setVistaSeleccionada(vista);
  };

  const abrirModalFinalizar = (turno) => {
    console.log('Abriendo modal con turno:', turno);
    setModalFinalizarData({
      isOpen: true,
      turno: turno
    });
  };

  const cerrarModalFinalizar = () => {
    setModalFinalizarData({
      isOpen: false,
      turno: null
    });
  };

  const onFinalizacionExitosa = () => {
    cargarTurnos();
  };

  const abrirModalDetalles = (turno) => {
    setModalDetallesData({
      isOpen: true,
      turno: turno
    });
  };

  const cerrarModalDetalles = () => {
    setModalDetallesData({
      isOpen: false,
      turno: null
    });
  };

  const formatearHora = (horaStr) => {
    if (!horaStr) return '';
    return horaStr.substring(0, 5);
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderTarjetaTurno = (turno) => {
    const getColorEstado = (estado) => {
      switch(estado) {
        case 'Pendiente': return 'warning';
        case 'Finalizado': return 'success';
        default: return 'secondary';
      }
    };

    const estadoActual = turno.EstadoTurno;

    return (
      <div key={turno.idTurno} className="col-md-6 col-lg-4 mb-3">
        <div className={`card shadow-sm h-100 border-${getColorEstado(estadoActual)}`}>
          <div className={`card-header bg-${getColorEstado(estadoActual)} text-white`}>
            <h6 className="mb-0 fw-bold">
              <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>event</span>
              Turno - {estadoActual}
            </h6>
          </div>
          <div className="card-body">
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>person</span></strong>
              {turno.NombrePaciente} {turno.ApellidoPaciente}
            </p>
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>badge</span></strong>
              DNI: {turno.DNI}
            </p>
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>calendar_today</span></strong>
              {formatearFecha(turno.FechaRequeridaTurno)}
            </p>
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>schedule</span></strong>
              {formatearHora(turno.HorarioRequeridoTurno)}
            </p>
          </div>
          <div className="card-footer bg-transparent">
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-info flex-grow-1"
                onClick={() => abrirModalDetalles(turno)}
              >
                <span className="material-symbols-outlined me-1" style={{fontSize: '16px'}}>visibility</span>
                Ver
              </button>
              {estadoActual === 'Pendiente' && (
                <button 
                  className="btn btn-sm btn-success flex-grow-1"
                  onClick={() => abrirModalFinalizar(turno)}
                >
                  <span className="material-symbols-outlined me-1" style={{fontSize: '16px'}}>edit_note</span>
                  Finalizar Turno
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h5 className="mb-0">
                    <span className="material-symbols-outlined me-2">calendar_today</span>
                    Mis Turnos
                  </h5>
                </div>
                <div className="col-md-8">
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className={`btn btn-sm ${vistaSeleccionada === 'dia' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleVistaChange('dia')}
                      >
                        Día
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-sm ${vistaSeleccionada === 'mes' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleVistaChange('mes')}
                      >
                        Mes
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {vistaSeleccionada === 'dia' && (
                        <>
                          <label className="mb-0 small">Fecha:</label>
                          <input 
                            type="date" 
                            className="form-control form-control-sm" 
                            style={{maxWidth: '150px'}}
                            value={obtenerValorInput()}
                            onChange={handleFechaChange}
                          />
                        </>
                      )}
                      
                      {vistaSeleccionada === 'mes' && (
                        <>
                          <label className="mb-0 small">Mes:</label>
                          <input 
                            type="month" 
                            className="form-control form-control-sm" 
                            style={{maxWidth: '150px'}}
                            value={obtenerValorInput()}
                            onChange={handleFechaChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">{turnosFiltrados.length}</h3>
              <p className="mb-0">Total Turnos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-warning">{turnosFiltrados.filter(t => t.EstadoTurno === 'Pendiente').length}</h3>
              <p className="mb-0">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success">{turnosFiltrados.filter(t => t.EstadoTurno === 'Finalizado').length}</h3>
              <p className="mb-0">Finalizados</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading || loadingEmpleados ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : !empleadoActual ? (
        <div className="alert alert-danger text-center">
          <span className="material-symbols-outlined me-2">error</span>
          No se pudo obtener la información del empleado. Por favor, contacta al administrador.
        </div>
      ) : (
        <>
          {/* Turnos Pendientes */}
          {turnosFiltrados.filter(t => t.EstadoTurno === 'Pendiente').length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">
                <span className="badge bg-warning me-2">{turnosFiltrados.filter(t => t.EstadoTurno === 'Pendiente').length}</span>
                Turnos Pendientes
              </h5>
              <div className="row">
                {turnosFiltrados
                  .filter(t => t.EstadoTurno === 'Pendiente')
                  .map(turno => renderTarjetaTurno(turno))}
              </div>
            </div>
          )}

          {/* Turnos Finalizados */}
          {turnosFiltrados.filter(t => t.EstadoTurno === 'Finalizado').length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">
                <span className="badge bg-success me-2">{turnosFiltrados.filter(t => t.EstadoTurno === 'Finalizado').length}</span>
                Turnos Finalizados
              </h5>
              <div className="row">
                {turnosFiltrados
                  .filter(t => t.EstadoTurno === 'Finalizado')
                  .map(turno => renderTarjetaTurno(turno))}
              </div>
            </div>
          )}

          {turnosFiltrados.length === 0 && (
            <div className="alert alert-info text-center">
              <span className="material-symbols-outlined me-2">info</span>
              No hay turnos para el período seleccionado
            </div>
          )}
        </>
      )}

      {modalFinalizarData.isOpen && (
        <FinalizarTurnoModal
          isOpen={modalFinalizarData.isOpen}
          turnoData={modalFinalizarData.turno}
          onClose={cerrarModalFinalizar}
          onFinalizarSuccess={onFinalizacionExitosa}
        />
      )}

      {modalDetallesData.isOpen && (
        <DetallesTurnoModal
          isOpen={modalDetallesData.isOpen}
          turno={modalDetallesData.turno}
          onClose={cerrarModalDetalles}
        />
      )}
    </div>
  );
};

export default TurnosKinesiologo;
