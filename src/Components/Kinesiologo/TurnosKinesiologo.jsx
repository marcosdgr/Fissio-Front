/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getTurnosDelDia } from '../../Custom/CustomTurnos';
import { showError } from '../../Utils/sweetAlerts';
import FinalizarTurnoModal from '../Admin/Turnos/FinalizarTurnoModal';
import DetallesTurnoModal from '../Admin/Turnos/DetallesTurnoModal';
import '../../Css/Admin/Turnos.css';

const TurnosKinesiologo = () => {
  const [turnos, setTurnos] = useState({
    solicitados: [],
    enCurso: [],
    finalizados: [],
    cancelados: []
  });
  const [resumen, setResumen] = useState({
    total: 0,
    solicitados: 0,
    enCurso: 0,
    finalizados: 0,
    cancelados: 0
  });
  const [vistaSeleccionada, setVistaSeleccionada] = useState('dia'); // 'dia', 'semana', 'mes'
  const [fechaConsulta, setFechaConsulta] = useState(() => {

    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato para 'dia'
  });
  const [isLoading, setIsLoading] = useState(true);
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
      
      case 'semana': {
        const diaSemana = fecha.getDay();
        const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;
        const lunes = new Date(fecha);
        lunes.setDate(fecha.getDate() + diferencia);
        
        // Obtener el domingo
        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate() + 6);
        
        fechaInicio = lunes.toISOString().split('T')[0];
        fechaFin = domingo.toISOString().split('T')[0];
        break;
      }
      
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

  const cargarTurnos = async (fecha = null) => {
    setIsLoading(true);
    try {
      const fechaBase = fecha ? new Date(fecha + 'T12:00:00') : new Date();
      const { fechaInicio, fechaFin } = obtenerRangoFechas(vistaSeleccionada, fechaBase);
      
      if (vistaSeleccionada === 'dia') {
        const response = await getTurnosDelDia(fecha);
        
        const turnosData = {
          solicitados: response.turnos?.solicitados || [],
          enCurso: response.turnos?.enCurso || [],
          finalizados: response.turnos?.finalizados || [],
          cancelados: response.turnos?.cancelados || []
        };
        
        const resumenData = {
          total: response.resumen?.total || 0,
          solicitados: response.resumen?.solicitados || 0,
          enCurso: response.resumen?.enCurso || 0,
          finalizados: response.resumen?.finalizados || 0,
          cancelados: response.resumen?.cancelados || 0
        };
        
        setTurnos(turnosData);
        setResumen(resumenData);
        setFechaConsulta(response.fechaConsulta);
      } else {
        const todosTurnos = {
          solicitados: [],
          enCurso: [],
          finalizados: [],
          cancelados: []
        };
        
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
          try {
            const fechaStr = d.toISOString().split('T')[0];
            const response = await getTurnosDelDia(fechaStr);
            
            if (response.turnos) {
              todosTurnos.solicitados.push(...(response.turnos.solicitados || []));
              todosTurnos.enCurso.push(...(response.turnos.enCurso || []));
              todosTurnos.finalizados.push(...(response.turnos.finalizados || []));
              todosTurnos.cancelados.push(...(response.turnos.cancelados || []));
            }
          } catch (err) {
            console.error(`Error al cargar turnos del ${d.toISOString().split('T')[0]}:`, err);
          }
        }
        
        const resumenData = {
          total: todosTurnos.solicitados.length + todosTurnos.enCurso.length + todosTurnos.finalizados.length + todosTurnos.cancelados.length,
          solicitados: todosTurnos.solicitados.length,
          enCurso: todosTurnos.enCurso.length,
          finalizados: todosTurnos.finalizados.length,
          cancelados: todosTurnos.cancelados.length
        };
        
        setTurnos(todosTurnos);
        setResumen(resumenData);
        setFechaConsulta(fecha || new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      showError('Error', 'No se pudieron cargar los turnos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hoy = new Date();
    let nuevaFecha = '';
    
    if (vistaSeleccionada === 'dia') {
      nuevaFecha = hoy.toISOString().split('T')[0];
    } else if (vistaSeleccionada === 'semana') {
      const year = hoy.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (hoy - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      nuevaFecha = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    } else if (vistaSeleccionada === 'mes') {
      const year = hoy.getFullYear();
      const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
      nuevaFecha = `${year}-${month}`;
    }
    
    setFechaConsulta(nuevaFecha);
    cargarTurnos();
  }, [vistaSeleccionada]);

  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaConsulta(nuevaFecha);
    let fechaParaApi = nuevaFecha;
    
    if (vistaSeleccionada === 'semana' && nuevaFecha) {
      const [year, week] = nuevaFecha.split('-W');
      const primerDiaAnio = new Date(year, 0, 1);
      const diasHastaLunes = (primerDiaAnio.getDay() === 0 ? -6 : 1) - primerDiaAnio.getDay();
      primerDiaAnio.setDate(primerDiaAnio.getDate() + diasHastaLunes);
      primerDiaAnio.setDate(primerDiaAnio.getDate() + (week - 1) * 7);
      const year2 = primerDiaAnio.getFullYear();
      const month2 = String(primerDiaAnio.getMonth() + 1).padStart(2, '0');
      const day2 = String(primerDiaAnio.getDate()).padStart(2, '0');
      fechaParaApi = `${year2}-${month2}-${day2}`;
    } else if (vistaSeleccionada === 'mes' && nuevaFecha) {
      const [year, month] = nuevaFecha.split('-');
      fechaParaApi = `${year}-${month}-01`;
    }
    
    cargarTurnos(fechaParaApi);
  };

  const handleVistaChange = (vista) => {
    setVistaSeleccionada(vista);
    cargarTurnos(fechaConsulta);
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
    cargarTurnos(fechaConsulta);
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

  const renderTarjetaTurno = (turno, estado) => {
    const getColorEstado = (estado) => {
      switch(estado) {
        case 'solicitado': return 'warning';
        case 'enCurso': return 'primary';
        case 'finalizado': return 'success';
        case 'cancelado': return 'danger';
        default: return 'secondary';
      }
    };

    return (
      <div key={turno.idTurno} className="col-md-6 col-lg-4 mb-3">
        <div className={`card shadow-sm h-100 border-${getColorEstado(estado)}`}>
          <div className={`card-header bg-${getColorEstado(estado)} text-white`}>
            <h6 className="mb-0 fw-bold">
              <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>event</span>
              {turno.NombreTratamiento || 'Turno'}
            </h6>
          </div>
          <div className="card-body">
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>person</span></strong>
              {turno.NombrePaciente} {turno.ApellidoPaciente}
            </p>
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>calendar_today</span></strong>
              {formatearFecha(turno.FechaRequeridaTurno)}
            </p>
            <p className="mb-2">
              <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>schedule</span></strong>
              {formatearHora(turno.HorarioRequeridoTurno)}
            </p>
            {turno.NombreProfesional && (
              <p className="mb-2">
                <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>medical_services</span></strong>
                {turno.NombreProfesional} {turno.ApellidoProfesional}
              </p>
            )}
            {turno.NombreServicio && (
              <p className="mb-2">
                <strong><span className="material-symbols-outlined me-1" style={{fontSize: '16px', verticalAlign: 'middle'}}>room</span></strong>
                {turno.NombreServicio}
              </p>
            )}
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
              {(estado === 'enCurso' || estado === 'finalizado') && (
                <button 
                  className="btn btn-sm btn-success flex-grow-1"
                  onClick={() => abrirModalFinalizar(turno)}
                >
                  <span className="material-symbols-outlined me-1" style={{fontSize: '16px'}}>edit_note</span>
                  Editar Informe
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
                        className={`btn btn-sm ${vistaSeleccionada === 'semana' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleVistaChange('semana')}
                      >
                        Semana
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
                            value={fechaConsulta}
                            onChange={handleFechaChange}
                          />
                        </>
                      )}
                      
                      {vistaSeleccionada === 'semana' && (
                        <>
                          <label className="mb-0 small">Semana:</label>
                          <input 
                            type="week" 
                            className="form-control form-control-sm" 
                            style={{maxWidth: '170px'}}
                            value={fechaConsulta}
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
                            value={fechaConsulta}
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
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">{resumen.total}</h3>
              <p className="mb-0">Total Turnos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-warning">{resumen.solicitados}</h3>
              <p className="mb-0">Solicitados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">{resumen.enCurso}</h3>
              <p className="mb-0">En Curso</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success">{resumen.finalizados}</h3>
              <p className="mb-0">Finalizados</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Turnos En Curso */}
          {turnos.enCurso.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">
                <span className="badge bg-primary me-2">{turnos.enCurso.length}</span>
                Turnos En Curso
              </h5>
              <div className="row">
                {turnos.enCurso.map(turno => renderTarjetaTurno(turno, 'enCurso'))}
              </div>
            </div>
          )}

          {/* Turnos Solicitados */}
          {turnos.solicitados.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">
                <span className="badge bg-warning me-2">{turnos.solicitados.length}</span>
                Turnos Solicitados
              </h5>
              <div className="row">
                {turnos.solicitados.map(turno => renderTarjetaTurno(turno, 'solicitado'))}
              </div>
            </div>
          )}

          {/* Turnos Finalizados */}
          {turnos.finalizados.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">
                <span className="badge bg-success me-2">{turnos.finalizados.length}</span>
                Turnos Finalizados
              </h5>
              <div className="row">
                {turnos.finalizados.map(turno => renderTarjetaTurno(turno, 'finalizado'))}
              </div>
            </div>
          )}

          {resumen.total === 0 && (
            <div className="alert alert-info text-center">
              <span className="material-symbols-outlined me-2">info</span>
              No hay turnos para esta fecha
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
