import  { useState, useEffect } from 'react';
import { getTurnosDelDia, cancelarTurno } from '../../../Custom/CustomTurnos';
import { showError, showSuccess, showConfirm } from '../../../Utils/sweetAlerts';
import AsignarRecursosModal from './AsignarRecursosModal';
import FinalizarTurnoModal from './FinalizarTurnoModal';
import SolicitarTurnoModal from './SolicitarTurnoModal';
import DetallesTurnoModal from './DetallesTurnoModal';

const Turnos = () => {
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
  const [fechaConsulta, setFechaConsulta] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState({
    isOpen: false,
    turno: null
  });
  const [modalFinalizarData, setModalFinalizarData] = useState({
    isOpen: false,
    turno: null
  });
  const [modalSolicitarData, setModalSolicitarData] = useState({
    isOpen: false
  });
  const [modalDetallesData, setModalDetallesData] = useState({
    isOpen: false,
    turno: null
  });

  // Cargar turnos del día
  const cargarTurnos = async (fecha = null) => {
    setIsLoading(true);
    try {
      const response = await getTurnosDelDia(fecha);
      
      // Asegurar que todos los arrays existan
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
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      showError('Error', 'No se pudieron cargar los turnos del día');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar turnos al montar el componente
  useEffect(() => {
    cargarTurnos();
  }, []);

  // Cambiar fecha de consulta
  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value;
    cargarTurnos(nuevaFecha);
  };

  // Abrir modal para asignar recursos
  const abrirModalAsignar = (turno) => {
    setModalData({
      isOpen: true,
      turno: turno
    });
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalData({
      isOpen: false,
      turno: null
    });
  };

  // Callback cuando se asignan recursos exitosamente
  const onAsignacionExitosa = () => {
    cargarTurnos(fechaConsulta); // ✅ Actualización automática del listado
  };

  // Abrir modal para finalizar turno
  const abrirModalFinalizar = (turno) => {
    setModalFinalizarData({
      isOpen: true,
      turno: turno
    });
  };

  // Cerrar modal de finalizar
  const cerrarModalFinalizar = () => {
    setModalFinalizarData({
      isOpen: false,
      turno: null
    });
  };

  // Callback cuando se finaliza un turno exitosamente
  const onFinalizacionExitosa = () => {
    cargarTurnos(fechaConsulta); // ✅ Actualización automática del listado
  };

  // Abrir modal para solicitar nuevo turno
  const abrirModalSolicitar = () => {
    setModalSolicitarData({
      isOpen: true
    });
  };

  // Cerrar modal de solicitar turno
  const cerrarModalSolicitar = () => {
    setModalSolicitarData({
      isOpen: false
    });
  };

  // Abrir modal para ver detalles del turno
  const abrirModalDetalles = (turno) => {
    setModalDetallesData({
      isOpen: true,
      turno: turno
    });
  };

  // Cerrar modal de detalles
  const cerrarModalDetalles = () => {
    setModalDetallesData({
      isOpen: false,
      turno: null
    });
  };

  // Callback cuando se solicita un turno exitosamente
  const onSolicitudExitosa = () => {
    cargarTurnos(fechaConsulta); // ✅ Actualización automática del listado
  };

  // Función para cancelar un turno
  const handleCancelarTurno = async (turno) => {
    try {
      const confirmResult = await showConfirm(
        '¿Cancelar Turno?',
        `¿Está seguro que desea cancelar el turno de ${turno.NombrePaciente} ${turno.ApellidoPaciente}?`,
        'Sí, cancelar',
        'No cancelar'
      );

      if (confirmResult.isConfirmed) {
        const idTurno = turno.IdTurno || turno.idTurno;
        const resultado = await cancelarTurno(idTurno);
        
        // Usar información específica de la respuesta del backend
        const mensaje = resultado.message || 'Turno cancelado correctamente';
        showSuccess('Éxito', `${mensaje} - Estado: ${resultado.estadoAnterior} → ${resultado.estadoActual}`);
        
        // ✅ Actualización automática del listado después de cancelar
        cargarTurnos(fechaConsulta);
      }
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      const errorMessage = error.response?.data?.message || 'Error al cancelar el turno';
      showError('Error', errorMessage);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">
              <span className="material-symbols-outlined me-2">event</span>
              Turnos del Día
            </h2>
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn text-white"
                style={{ backgroundColor: '#3AB1CF' }}
                onClick={abrirModalSolicitar}
              >
                <span className="material-symbols-outlined me-1">add_circle</span>
                Solicitar Nuevo Turno
              </button>
              <div className="d-flex align-items-center">
                <label htmlFor="fechaConsulta" className="form-label me-2 mb-0">
                  Fecha:
                </label>
                <input
                  type="date"
                  id="fechaConsulta"
                  className="form-control"
                  value={fechaConsulta}
                  onChange={handleFechaChange}
                  style={{ width: '150px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">{resumen.total}</h5>
              <p className="card-text">Total</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">{resumen.solicitados}</h5>
              <p className="card-text">Solicitados</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="card-title text-info">{resumen.enCurso}</h5>
              <p className="card-text">En Curso</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="card-title text-success">{resumen.finalizados}</h5>
              <p className="card-text">Finalizados</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">{resumen.cancelados || 0}</h5>
              <p className="card-text">Cancelados</p>
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
        <div className="row">
          {/* Turnos Solicitados */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-header bg-warning text-white">
                <h5 className="mb-0">
                  <span className="material-symbols-outlined me-2">pending</span>
                  Solicitados ({turnos.solicitados.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {turnos.solicitados.length === 0 ? (
                  <p className="text-muted p-3 mb-0">No hay turnos solicitados</p>
                ) : (
                  turnos.solicitados.map((turno) => (
                    <TurnoCard 
                      key={turno.idTurno} 
                      turno={turno} 
                      onAsignarRecursos={abrirModalAsignar}
                      onCancelarTurno={handleCancelarTurno}
                      onVerDetalles={abrirModalDetalles}
                      esSolicitado={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Turnos En Curso */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <span className="material-symbols-outlined me-2">schedule</span>
                  En Curso ({turnos.enCurso.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {turnos.enCurso.length === 0 ? (
                  <p className="text-muted p-3 mb-0">No hay turnos en curso</p>
                ) : (
                  turnos.enCurso.map((turno) => (
                    <TurnoCard 
                      key={turno.idTurno} 
                      turno={turno} 
                      onFinalizarTurno={abrirModalFinalizar}
                      onCancelarTurno={handleCancelarTurno}
                      onVerDetalles={abrirModalDetalles}
                      esEnCurso={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Turnos Finalizados */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <span className="material-symbols-outlined me-2">check_circle</span>
                  Finalizados ({turnos.finalizados.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {turnos.finalizados.length === 0 ? (
                  <p className="text-muted p-3 mb-0">No hay turnos finalizados</p>
                ) : (
                  turnos.finalizados.map((turno) => (
                    <TurnoCard 
                      key={turno.idTurno} 
                      turno={turno} 
                      onVerDetalles={abrirModalDetalles}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Turnos Cancelados */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">
                  <span className="material-symbols-outlined me-2">cancel</span>
                  Cancelados ({turnos.cancelados?.length || 0})
                </h5>
              </div>
              <div className="card-body p-0">
                {(!turnos.cancelados || turnos.cancelados.length === 0) ? (
                  <p className="text-muted p-3 mb-0">No hay turnos cancelados</p>
                ) : (
                  turnos.cancelados.map((turno) => (
                    <TurnoCard 
                      key={turno.idTurno} 
                      turno={turno} 
                      onVerDetalles={abrirModalDetalles}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para asignar recursos */}
      <AsignarRecursosModal
        turno={modalData.turno}
        isOpen={modalData.isOpen}
        onClose={cerrarModal}
        onSuccess={onAsignacionExitosa}
      />

      {/* Modal para finalizar turno */}
      <FinalizarTurnoModal
        turnoData={modalFinalizarData.turno}
        isOpen={modalFinalizarData.isOpen}
        onClose={cerrarModalFinalizar}
        onFinalizarSuccess={onFinalizacionExitosa}
      />

      {/* Modal para solicitar nuevo turno */}
      <SolicitarTurnoModal
        isOpen={modalSolicitarData.isOpen}
        onClose={cerrarModalSolicitar}
        onSolicitudExitosa={onSolicitudExitosa}
      />

      {/* Modal para ver detalles del turno */}
      <DetallesTurnoModal
        isOpen={modalDetallesData.isOpen}
        onClose={cerrarModalDetalles}
        turno={modalDetallesData.turno}
      />
    </div>
  );
};

// Componente para mostrar cada turno
const TurnoCard = ({ turno, onAsignarRecursos, onFinalizarTurno, onCancelarTurno, onVerDetalles, esSolicitado = false, esEnCurso = false }) => {
  return (
    <div className="border-bottom p-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="mb-1">
          {turno.NombrePaciente} {turno.ApellidoPaciente}
        </h6>
        <small className="text-muted">{turno.HorarioRequeridoTurno}</small>
      </div>
      <p className="text-muted mb-1 small">
        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
          badge
        </span>
        DNI: {turno.DNI}
      </p>
      <p className="text-muted mb-1 small">
        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
          phone
        </span>
        {turno.TelefonoPaciente}
      </p>
      {turno.NombreEmpleado && (
        <p className="text-muted mb-1 small">
          <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
            person
          </span>
          {turno.NombreEmpleado} {turno.ApellidoEmpleado}
        </p>
      )}
      {turno.NombreSala && (
        <p className="text-muted mb-1 small">
          <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
            meeting_room
          </span>
          {turno.NombreSala}
        </p>
      )}
      
      {/* Botón para asignar recursos solo en turnos solicitados */}
      {esSolicitado && (
        <div className="mt-2">
          <div className="row g-1">
            <div className="col-6">
              <button
                className="btn btn-sm btn-primary w-100"
                onClick={() => onAsignarRecursos(turno)}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: '14px' }}>
                  person_add
                </span>
                Asignar
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => onCancelarTurno(turno)}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: '14px' }}>
                  cancel
                </span>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botones para turnos en curso */}
      {esEnCurso && (
        <div className="mt-2">
          <div className="row g-1">
            <div className="col-6">
              <button
                className="btn btn-sm btn-success w-100"
                onClick={() => onFinalizarTurno(turno)}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: '14px' }}>
                  check_circle
                </span>
                Finalizar
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => onCancelarTurno(turno)}
              >
                <span className="material-symbols-outlined me-1" style={{ fontSize: '14px' }}>
                  cancel
                </span>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón Ver Detalles - disponible para todos los turnos */}
      <div className="mt-2">
        <button
          className="btn btn-sm btn-outline-primary w-100"
          onClick={() => onVerDetalles(turno)}
        >
          <span className="material-symbols-outlined me-1" style={{ fontSize: '14px' }}>
            visibility
          </span>
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default Turnos;
