import  { useState, useEffect } from 'react';
import { getTurnosDelDia } from '../../../Custom/CustomTurnos';
import { showError } from '../../../Utils/sweetAlerts';
import AsignarRecursosModal from './AsignarRecursosModal';
import FinalizarTurnoModal from './FinalizarTurnoModal';

const Turnos = () => {
  const [turnos, setTurnos] = useState({
    solicitados: [],
    enCurso: [],
    finalizados: []
  });
  const [resumen, setResumen] = useState({
    total: 0,
    solicitados: 0,
    enCurso: 0,
    finalizados: 0
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

  // Cargar turnos del día
  const cargarTurnos = async (fecha = null) => {
    setIsLoading(true);
    try {
      const response = await getTurnosDelDia(fecha);
      setTurnos(response.turnos);
      setResumen(response.resumen);
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
    cargarTurnos(fechaConsulta); // Recargar turnos con la misma fecha
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
    cargarTurnos(fechaConsulta); // Recargar turnos con la misma fecha
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

      {/* Resumen */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">{resumen.total}</h5>
              <p className="card-text">Total</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">{resumen.solicitados}</h5>
              <p className="card-text">Solicitados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="card-title text-info">{resumen.enCurso}</h5>
              <p className="card-text">En Curso</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="card-title text-success">{resumen.finalizados}</h5>
              <p className="card-text">Finalizados</p>
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
          <div className="col-lg-4 mb-4">
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
                      esSolicitado={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Turnos En Curso */}
          <div className="col-lg-4 mb-4">
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
                      esEnCurso={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Turnos Finalizados */}
          <div className="col-lg-4 mb-4">
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
                    <TurnoCard key={turno.idTurno} turno={turno} />
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
    </div>
  );
};

// Componente para mostrar cada turno
const TurnoCard = ({ turno, onAsignarRecursos, onFinalizarTurno, esSolicitado = false, esEnCurso = false }) => {
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
          <button
            className="btn btn-sm btn-primary w-100"
            onClick={() => onAsignarRecursos(turno)}
          >
            <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
              person_add
            </span>
            Asignar Kinesiólogo
          </button>
        </div>
      )}

      {/* Botón para finalizar turno solo en turnos en curso */}
      {esEnCurso && (
        <div className="mt-2">
          <button
            className="btn btn-sm btn-success w-100"
            onClick={() => onFinalizarTurno(turno)}
          >
            <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>
              check_circle
            </span>
            Finalizar Turno
          </button>
        </div>
      )}
    </div>
  );
};

export default Turnos;
