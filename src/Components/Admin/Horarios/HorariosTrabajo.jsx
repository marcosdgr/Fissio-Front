import React, { useState } from "react";
import FormHorario from "./FormHorario";
import useCustomHorarios from "../../../Custom/useCustomHorarios";
import { toast } from "sonner";
import Swal from "sweetalert2";

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

  const refrescar = () => obtenerDatos();

  const abrirModal = (horario = null) => {
    setHorarioSeleccionado(horario);
    setOpenModal(true);
  };

  const confirmarDesactivar = async (id) => {
    const res = await Swal.fire({
      title: "¿Desactivar horario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });
    if (res.isConfirmed) {
      const result = await desactivarHorario(id);
      if (result.success) {
        toast.success("Horario desactivado");
        refrescar();
      } else {
        toast.error(result.error);
      }
    }
  };

  const confirmarReactivar = async (id) => {
    const res = await Swal.fire({
      title: "¿Reactivar horario?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });
    if (res.isConfirmed) {
      const result = await reactivarHorario(id);
      if (result.success) {
        toast.success("Horario reactivado");
        refrescar();
      } else {
        toast.error(result.error);
      }
    }
  };

  const asignar = async () => {
    if (!empleadoSeleccionado || !horarioParaAsignar) return;
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
    const res = await Swal.fire({
      title: "¿Quitar horario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });
    if (res.isConfirmed) {
      const result = await eliminarAsignacion(idEmpHor);
      if (result.success) {
        toast.success("Asignación eliminada");
        refrescar();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">

          {loading && (
            <div className="alert alert-info">
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
                  <button className="btn btn-primary" onClick={() => abrirModal()}>
                    + Nuevo Horario
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Día</th>
                          <th>Entrada</th>
                          <th>Salida</th>
                          <th>Descripción</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.horarios.map(h => (
                          <tr key={h.idHorario}>
                            <td>{h.idHorario}</td>
                            <td><strong>{h.DiaSemana}</strong></td>
                            <td>{h.HoraEntradaEsperada}</td>
                            <td>{h.HoraSalidaEsperada}</td>
                            <td>{h.DescripcionHorario || '-'}</td>
                            <td>
                              <span className={`badge ${h.IsActive ? 'bg-success' : 'bg-secondary'}`}>
                                {h.IsActive ? 'ACTIVO' : 'INACTIVO'}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => abrirModal(h)}>
                                Editar
                              </button>
                              {h.IsActive ? (
                                <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarDesactivar(h.idHorario)}>
                                  Desactivar
                                </button>
                              ) : (
                                <button className="btn btn-sm btn-outline-success" onClick={() => confirmarReactivar(h.idHorario)}>
                                  Reactivar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ASIGNACIÓN */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Asignar Horario a Empleado</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-5">
                      <label className="form-label">Empleado</label>
                      <select className="form-select" value={empleadoSeleccionado} onChange={e => setEmpleadoSeleccionado(e.target.value)}>
                        <option value="">Seleccione empleado</option>
                        {data.empleados.map(e => (
                          <option key={e.idEmpleado} value={e.idEmpleado}>{e.NombreCompleto}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Horario</label>
                      <select className="form-select" value={horarioParaAsignar} onChange={e => setHorarioParaAsignar(e.target.value)}>
                        <option value="">Seleccione horario</option>
                        {data.horarios.map(h => (
                          <option key={h.idHorario} value={h.idHorario}>
                            {h.DiaSemana} ({h.HoraEntradaEsperada} - {h.HoraSalidaEsperada})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button className="btn btn-success w-100" onClick={asignar}>
                        Asignar
                      </button>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h6>Asignaciones Actuales</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
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
                        {data.asignaciones.map(a => (
                          <tr key={a.idEmpHor}>
                            <td>{a.NombreEmpleado} {a.ApellidoEmpleado}</td>
                            <td>{a.DiaSemana}</td>
                            <td>{a.HoraEntradaEsperada}</td>
                            <td>{a.HoraSalidaEsperada}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => quitar(a.idEmpHor)}>
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {horarioSeleccionado ? 'Editar Horario' : 'Nuevo Horario'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setOpenModal(false)}></button>
              </div>
              <div className="modal-body">
                <FormHorario
                  horario={horarioSeleccionado}
                  onSuccess={() => {
                    setOpenModal(false);
                    refrescar();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HorariosTrabajo;