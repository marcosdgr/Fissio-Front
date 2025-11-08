import React, { useState } from "react";
import FormTratamientos from "./FormTratamientos";
import useCustomTratamientos from "../../../Custom/useCustomTratamientos";
import Swal from "sweetalert2";

const Tratamientos = () => {
  const {
    tratamientos,
    loading,
    error,
    cambiarEstadoTratamiento,
    obtenerTratamientos,
  } = useCustomTratamientos();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);

  // Ordenar por ID descendente
  const resultado = (tratamientos.tratamientos || [])
    .slice()
    .sort((a, b) => b.idTratamiento - a.idTratamiento);

  const refrescarLista = async () => {
    await obtenerTratamientos();
  };

  // Handlers
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

  // CAMBIAR ESTADO
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
          {/* Loading */}
          {loading && (
            <div className="alert alert-info" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              Cargando tratamientos...
            </div>
          )}

          {/* Error */}
          {error && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Tratamientos</h5>
                <button type="button" className="btn btn-primary" onClick={abrirModalAgregar}>
                  Agregar nuevo Tratamiento
                </button>
              </div>
              <div className="alert alert-danger" role="alert">
                Ocurrió un error al cargar los tratamientos
              </div>
            </>
          )}

          {/* Normal */}
          {!loading && !error && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Tratamientos</h5>
                <button type="button" className="btn btn-primary" onClick={abrirModalAgregar}>
                  Agregar nuevo Tratamiento
                </button>
              </div>

              {/* Tabla */}
              {(!tratamientos || tratamientos.tratamientos?.length === 0) ? (
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    No hay tratamientos disponibles. ¡Agrega tu primer tratamiento!
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
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
                            <td>{trat.idTratamiento}</td>
                            <td className="fw-bold">{trat.NombreTratamiento}</td>
                            <td>{trat.DescripcionTratamiento?.substring(0, 60)}...</td>
                            <td>{trat.DuracionTratamiento}</td>
                            <td>
                              <span
                                className={`badge ${
                                  trat.IsActive ? "bg-success" : "bg-danger"
                                } rounded-pill`}
                              >
                                {trat.IsActive ? "ACTIVO" : "INACTIVO"}
                              </span>
                            </td>

                            {/* BOTONES 100% IGUALES QUE EN FAQs */}
                            <td className="text-center">
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() => verTratamiento(trat)}
                                >
                                  Ver
                                </button>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => abrirModalEditar(trat)}
                                >
                                  Editar
                                </button>
                                <button
                                  className={`btn ${
                                    trat.IsActive ? "btn-outline-danger" : "btn-outline-success"
                                  } btn-sm`}
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

      {/* Modal Form */}
      {openFormModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5 text-dark">
                  {tratamientoSeleccionado ? "Editar Tratamiento" : "Agregar Nuevo Tratamiento"}
                </h1>
                <button type="button" className="btn-close" onClick={cerrarModalForm}></button>
              </div>
              <div className="modal-body">
                <FormTratamientos
                  tratamiento={tratamientoSeleccionado}
                  onSuccess={() => {
                    refrescarLista();
                    cerrarModalForm();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver */}
      {openModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">
                  {tratamientoSeleccionado?.NombreTratamiento}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpenModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Descripción:</strong> {tratamientoSeleccionado?.DescripcionTratamiento}
                </p>
                <p>
                  <strong>Duración:</strong> {tratamientoSeleccionado?.DuracionTratamiento} minutos
                </p>
                <p>
                  <strong>Informe:</strong>{" "}
                  {tratamientoSeleccionado?.InformeTratamiento || "Sin informe"}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {tratamientoSeleccionado?.IsActive ? "ACTIVO" : "INACTIVO"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tratamientos;