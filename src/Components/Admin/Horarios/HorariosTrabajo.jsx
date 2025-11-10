import React, { useState, useEffect } from "react";
import FormHorario from "./FormHorario";
import useCustomHorarios from "../../../Custom/useCustomHorarios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import "../../../Css/Horarios/HorariosTrabajo.css";

const HorariosTrabajo = () => {
  const {
    data,
    loading,
    error,
    obtenerDatos,
    desactivarHorario,
    reactivarHorario,
    asignarHorario,
    eliminarAsignacion
  } = useCustomHorarios();

  const [openModal, setOpenModal] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [horarioParaAsignar, setHorarioParaAsignar] = useState("");
  const [listaHorarios, setListaHorarios] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [listaAsignaciones, setListaAsignaciones] = useState([]);

  useEffect(() => {
    if (data?.horarios) setListaHorarios(data.horarios);
    if (data?.empleados) setListaEmpleados(data.empleados);
    if (data?.asignaciones) setListaAsignaciones(data.asignaciones);
  }, [data]);

  const refrescar = () => obtenerDatos();

  const abrirModal = (horario = null) => {
    setHorarioSeleccionado(horario);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setHorarioSeleccionado(null);
  };

  const handleCambiarEstado = async (idHorario) => {
    const horario = listaHorarios.find(h => h.idHorario === idHorario);
    const nuevoEstado = horario.IsActive ? 0 : 1;
    const accion = horario.IsActive ? "desactivar" : "reactivar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} horario?`,
      text: `${horario.DiaSemana} (${horario.HoraEntradaEsperada} - ${horario.HoraSalidaEsperada})`,
      icon: horario.IsActive ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#dc3545",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const fn = horario.IsActive ? desactivarHorario : reactivarHorario;
      const res = await fn(idHorario);

      if (res.success) {
        setListaHorarios(prev =>
          prev.map(h =>
            h.idHorario === idHorario ? { ...h, IsActive: nuevoEstado } : h
          )
        );
        toast.success(`Horario ${nuevoEstado ? "reactivado" : "desactivado"}`);
      } else {
        toast.error(res.error || "Error al cambiar estado");
      }
    }
  };

  const asignar = async () => {
    if (!empleadoSeleccionado || !horarioParaAsignar) {
      toast.error("Selecciona empleado y horario");
      return;
    }
    const res = await asignarHorario(empleadoSeleccionado, horarioParaAsignar);
    if (res.success) {
      toast.success("Horario asignado");
      setEmpleadoSeleccionado("");
      setHorarioParaAsignar("");
      refrescar();
    } else {
      toast.error(res.error);
    }
  };

  const quitar = async (idEmpHor) => {
    const result = await Swal.fire({
      title: "¿Quitar asignación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      const res = await eliminarAsignacion(idEmpHor);
      if (res.success) {
        toast.success("Asignación eliminada");
        refrescar();
      } else {
        toast.error(res.error);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          {loading && (
            <div className="alert alert-info loading-alert">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Cargando horarios y asignaciones...
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {/* HORARIOS */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Horarios de Trabajo</h5>
                  <button className="btn btn-primary btn-agregar" onClick={() => abrirModal()}>
                    + Nuevo Horario
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="table-id">ID</th>
                          <th>Día</th>
                          <th>Entrada</th>
                          <th>Salida</th>
                          <th>Descripción</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaHorarios.map(h => (
                          <tr
                            key={h.idHorario}
                            className={!h.IsActive ? "horario-inactivo" : ""}
                          >
                            <td className="table-id">{h.idHorario}</td>
                            <td className="fw-bold">{h.DiaSemana}</td>
                            <td>{h.HoraEntradaEsperada}</td>
                            <td>{h.HoraSalidaEsperada}</td>
                            <td>{h.DescripcionHorario || "-"}</td>
                            <td>
                              <span className={`badge ${h.IsActive ? "badge-activo" : "badge-inactivo"}`}>
                                {h.IsActive ? "ACTIVO" : "INACTIVO"}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="action-buttons">
                                <button
                                  className="btn btn-editar"
                                  onClick={() => abrirModal(h)}
                                >
                                  Editar
                                </button>
                                <button
                                  className={`btn ${h.IsActive ? "btn-desactivar" : "btn-activar"}`}
                                  onClick={() => handleCambiarEstado(h.idHorario)}
                                >
                                  {h.IsActive ? "Desactivar" : "Reactivar"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ASIGNACIONES */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Asignar Horario a Empleado</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                      <label className="form-label fw-medium">Empleado</label>
                      <select
                        className="form-select"
                        value={empleadoSeleccionado}
                        onChange={e => setEmpleadoSeleccionado(e.target.value)}
                      >
                        <option value="">Seleccione empleado</option>
                        {listaEmpleados.map(e => (
                          <option key={e.idEmpleado} value={e.idEmpleado}>
                            {e.NombreCompleto}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-medium">Horario</label>
                      <select
                        className="form-select"
                        value={horarioParaAsignar}
                        onChange={e => setHorarioParaAsignar(e.target.value)}
                      >
                        <option value="">Seleccione horario</option>
                        {listaHorarios
                          .filter(h => h.IsActive)
                          .map(h => (
                            <option key={h.idHorario} value={h.idHorario}>
                              {h.DiaSemana} ({h.HoraEntradaEsperada} - {h.HoraSalidaEsperada})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-success w-100" onClick={asignar}>
                        Asignar
                      </button>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h6 className="fw-bold">Asignaciones Actuales</h6>
                  {listaAsignaciones.length === 0 ? (
                    <p className="text-muted">No hay asignaciones</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Empleado</th>
                            <th>Día</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listaAsignaciones.map(a => (
                            <tr key={a.idEmpHor}>
                              <td className="fw-medium">{a.NombreEmpleado} {a.ApellidoEmpleado}</td>
                              <td>{a.DiaSemana}</td>
                              <td>{a.HoraEntradaEsperada}</td>
                              <td>{a.HoraSalidaEsperada}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => quitar(a.idEmpHor)}
                                >
                                  Quitar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL FORM - CON BOTÓN X PREMIUM */}
      {openModal && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h5 className="modal-title fw-bold">
                  {horarioSeleccionado ? "Editar Horario" : "Nuevo Horario"}
                </h5>
                <button
                  type="button"
                  className="btn-close-modal-x"
                  onClick={cerrarModal}
                  aria-label="Cerrar"
                  title="Cerrar sin guardar"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body p-4">
                <FormHorario
                  horario={horarioSeleccionado}
                  onSuccess={() => {
                    cerrarModal();
                    refrescar();
                  }}
                  onClose={cerrarModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {openModal && <div className="modal-backdrop-custom fade-in"></div>}
    </>
  );
};

export default HorariosTrabajo;