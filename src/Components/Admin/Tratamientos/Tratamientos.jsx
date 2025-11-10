import React, { useState } from "react";
import FormTratamientos from "./FormTratamientos";
import useCustomTratamientos from "../../../Custom/useCustomTratamientos";
import Swal from "sweetalert2";
import "../../../Css/Tratamientos/Tratamientos.css";

const Tratamientos = () => {
  const {
    tratamientos,
    loading,
    error,
    cambiarEstadoTratamiento,
    obtenerTratamientos,
  } = useCustomTratamientos();

  const [openModal, setOpenModal] = useState(false);        // Modal VER
  const [openFormModal, setOpenFormModal] = useState(false); // Modal FORM
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);

  const resultado = (tratamientos.tratamientos || [])
    .slice()
    .sort((a, b) => b.idTratamiento - a.idTratamiento);

  const refrescarLista = async () => {
    await obtenerTratamientos();
  };

  const verTratamiento = (tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setOpenModal(true);
  };

  const abrirModalAgregar = () => {
    setTratamientoSeleccionado(null);
    setOpenFormModal(true);
  };

  const abrirModalEditar = (tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setOpenFormModal(true);
  };

  const cerrarModalForm = () => {
    setOpenFormModal(false);
    setTratamientoSeleccionado(null);
  };

  const cerrarModalVer = () => {
    setOpenModal(false);
    setTratamientoSeleccionado(null);
  };

  const handleCambiarEstado = async (tratamiento) => {
    const nuevoEstado = tratamiento.IsActive ? 0 : 1;
    const accion = tratamiento.IsActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} tratamiento?`,
      text: `"${tratamiento.NombreTratamiento}" será ${nuevoEstado ? "activado" : "desactivado"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#ffc107",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const { success } = await cambiarEstadoTratamiento(tratamiento.idTratamiento, nuevoEstado);
      if (success) {
        Swal.fire("Éxito", `Tratamiento ${nuevoEstado ? "activado" : "desactivado"}.`, "success");
        refrescarLista();
      } else {
        Swal.fire("Error", "No se pudo cambiar el estado.", "error");
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          {loading && (
            <div className="alert alert-info loading-alert" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              Cargando tratamientos...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Tratamientos</h5>
                <button
                  type="button"
                  className="btn btn-primary btn-agregar"
                  onClick={abrirModalAgregar}
                >
                  Agregar nuevo Tratamiento
                </button>
              </div>

              {(!tratamientos || tratamientos.tratamientos?.length === 0) ? (
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    No hay tratamientos disponibles. ¡Agrega tu primer tratamiento!
                  </div>
                </div>
              ) : (
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="table-id">ID</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Duración (min)</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.map((trat) => (
                          <tr key={trat.idTratamiento}>
                            <td className="table-id">{trat.idTratamiento}</td>
                            <td className="fw-bold">{trat.NombreTratamiento}</td>
                            <td>{trat.DescripcionTratamiento?.substring(0, 60)}...</td>
                            <td>{trat.DuracionTratamiento}</td>
                            <td>
                              <span className={`badge ${trat.IsActive ? "bg-success" : "bg-danger"} rounded-pill px-2`}>
                                {trat.IsActive ? "ACTIVO" : "INACTIVO"}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="action-buttons">
                                <button className="btn btn-info btn-sm btn-action" title="Ver" onClick={() => verTratamiento(trat)}>
                                  Ver
                                </button>
                                <button className="btn btn-primary btn-sm btn-action" title="Editar" onClick={() => abrirModalEditar(trat)}>
                                  Editar
                                </button>
                                <button
                                  className={`btn ${trat.IsActive ? "btn-warning" : "btn-success"} btn-sm btn-action`}
                                  title={trat.IsActive ? "Desactivar" : "Activar"}
                                  onClick={() => handleCambiarEstado(trat)}
                                >
                                  {trat.IsActive ? "Desactivar" : "Activar"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL VER TRATAMIENTO */}
      {openModal && tratamientoSeleccionado && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h5 className="modal-title fw-bold">{tratamientoSeleccionado.NombreTratamiento}</h5>
                <button
                  type="button"
                  className="btn-close-modal-x"
                  onClick={cerrarModalVer}
                  aria-label="Cerrar"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Descripción:</strong> {tratamientoSeleccionado.DescripcionTratamiento}</p>
                <p><strong>Duración:</strong> {tratamientoSeleccionado.DuracionTratamiento} minutos</p>
                <p><strong>Informe:</strong> {tratamientoSeleccionado.InformeTratamiento || "Sin informe"}</p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ${tratamientoSeleccionado.IsActive ? "bg-success" : "bg-danger"}`}>
                    {tratamientoSeleccionado.IsActive ? "ACTIVO" : "INACTIVO"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO */}
      {openFormModal && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h1 className="modal-title fs-5 fw-bold">
                  {tratamientoSeleccionado ? "Editar Tratamiento" : "Agregar Nuevo Tratamiento"}
                </h1>
                <button
                  type="button"
                  className="btn-close-modal-x"
                  onClick={cerrarModalForm}
                  aria-label="Cerrar formulario"
                  title="Cerrar sin guardar"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body p-4">
                <FormTratamientos
                  tratamiento={tratamientoSeleccionado}
                  onSuccess={() => {
                    refrescarLista();
                    cerrarModalForm();
                  }}
                  onClose={cerrarModalForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACKDROP */}
      {(openFormModal || openModal) && <div className="modal-backdrop-custom fade-in"></div>}
    </>
  );
};

export default Tratamientos;