import React, { useState, useEffect } from "react";
import {
  asignarRecursos,
  getKinesiologosDisponibles,
} from "../../../Custom/CustomTurnos";
import { showSuccess, showError } from "../../../Utils/sweetAlerts";

const AsignarRecursosModal = ({ turno, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    HorarioInicioTurno: "",
    HorarioFinTurno: "",
    idEmpleado: "",
    ObservacionesSecretaria: "",
  });

  const [kinesiologos, setKinesiologos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar kinesiologos y salas al abrir el modal
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoadingData(true);
      try {
        // Obtener fecha del turno para kinesiologos presentes
        let fechaTurno = new Date().toISOString().split("T")[0]; // fallback a hoy
        
        if (turno?.FechaRequeridaTurno) {
          // Si es un timestamp, extraer solo la fecha
          fechaTurno = new Date(turno.FechaRequeridaTurno).toISOString().split("T")[0];
        }

        const kinesiologosRes = await getKinesiologosDisponibles(fechaTurno);
        setKinesiologos(kinesiologosRes.kinesiologos || kinesiologosRes);
      } catch (error) {
        console.error("Error al cargar kinesiologos:", error);
        showError(
          "Error",
          "No se pudieron cargar los kinesiologos: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
      cargarDatos();
      // Pre-llenar con horario sugerido si existe
      if (turno?.HorarioRequeridoTurno) {
        const horario = turno.HorarioRequeridoTurno;
        setFormData((prev) => ({
          ...prev,
          HorarioInicioTurno: horario,
          HorarioFinTurno: calcularHorarioFin(horario),
        }));
      }
    }
  }, [
    isOpen,
    turno?.idTurno,
    turno?.HorarioRequeridoTurno,
    turno?.FechaRequeridaTurno,
  ]);

  const calcularHorarioFin = (inicio) => {
    if (!inicio) return "";
    const [horas, minutos] = inicio.split(":");
    const fechaInicio = new Date();
    fechaInicio.setHours(parseInt(horas), parseInt(minutos), 0);
    fechaInicio.setMinutes(fechaInicio.getMinutes() + 60); // Agregar 1 hora
    return fechaInicio.toTimeString().slice(0, 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calcular hora fin cuando cambia hora inicio
    if (name === "HorarioInicioTurno") {
      setFormData((prev) => ({
        ...prev,
        HorarioFinTurno: calcularHorarioFin(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await asignarRecursos(turno.idTurno, formData);
      showSuccess("¡Kinesiólogo asignado!", response.message);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al asignar kinesiólogo:", error);
      showError(
        "Error",
        error.response?.data?.message || "Error al asignar kinesiólogo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <span className="material-symbols-outlined me-2">person_add</span>
              Asignar Kinesiólogo
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {/* Información del paciente */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">Información del Turno</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Paciente:</strong> {turno?.NombrePaciente}{" "}
                      {turno?.ApellidoPaciente}
                    </p>
                    <p>
                      <strong>DNI:</strong> {turno?.DNI}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Horario solicitado:</strong>{" "}
                      {turno?.HorarioRequeridoTurno}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {turno?.TelefonoPaciente}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isLoadingData ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label
                        htmlFor="HorarioInicioTurno"
                        className="form-label"
                      >
                        <span className="material-symbols-outlined me-1">
                          schedule
                        </span>
                        Hora de inicio *
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="HorarioInicioTurno"
                        name="HorarioInicioTurno"
                        value={formData.HorarioInicioTurno}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="HorarioFinTurno" className="form-label">
                        <span className="material-symbols-outlined me-1">
                          schedule
                        </span>
                        Hora de fin *
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="HorarioFinTurno"
                        name="HorarioFinTurno"
                        value={formData.HorarioFinTurno}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="idEmpleado" className="form-label">
                        <span className="material-symbols-outlined me-1">
                          person
                        </span>
                        Kinesiólogo *
                      </label>
                      <select
                        className="form-select"
                        id="idEmpleado"
                        name="idEmpleado"
                        value={formData.idEmpleado}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          {kinesiologos.length === 0
                            ? "No hay kinesiologos presentes para esta fecha"
                            : "Seleccionar kinesiólogo"}
                        </option>
                        {kinesiologos.map((kine) => (
                          <option key={kine.idEmpleado} value={kine.idEmpleado}>
                            {kine.NombreEmpleado} {kine.ApellidoEmpleado}
                            {kine.HoraEntrada &&
                              ` (Ingreso: ${kine.HoraEntrada})`}
                          </option>
                        ))}
                      </select>
                      {kinesiologos.length === 0 && (
                        <div className="text-muted small mt-1">
                          💡 Asegúrate de que haya kinesiologos marcados como
                          presentes para esta fecha
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="ObservacionesSecretaria"
                    className="form-label"
                  >
                    <span className="material-symbols-outlined me-1">note</span>
                    Observaciones de secretaría
                  </label>
                  <textarea
                    className="form-control"
                    id="ObservacionesSecretaria"
                    name="ObservacionesSecretaria"
                    rows="3"
                    value={formData.ObservacionesSecretaria}
                    onChange={handleChange}
                    placeholder="Observaciones adicionales (opcional)"
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Asignando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined me-2">
                          person_add
                        </span>
                        Asignar Kinesiólogo
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarRecursosModal;
