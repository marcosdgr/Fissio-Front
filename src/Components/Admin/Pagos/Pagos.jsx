import React, { useState } from "react";
import FormPagos from "./FormPagos";
import useCustomPagos from "../../../Custom/useCustomPagos";
import Swal from "sweetalert2";
import "../../../Css/Pagos/Pagos.css";

const Pagos = () => {
  const {
    pagos,
    loading,
    error,
    obtenerPagos,
    eliminarPago
  } = useCustomPagos();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  const resultado = (pagos.pagos || [])
    .slice()
    .sort((a, b) => b.idPago - a.idPago);

  const refrescarLista = async () => {
    await obtenerPagos();
  };

  const verPago = (pago) => {
    setPagoSeleccionado(pago);
    setOpenModal(true);
  };

  const abrirModalAgregar = () => {
    setPagoSeleccionado(null);
    setOpenFormModal(true);
  };

  const abrirModalEditar = (pago) => {
    setPagoSeleccionado(pago);
    setOpenFormModal(true);
  };

  const cerrarModalForm = () => {
    setOpenFormModal(false);
    setPagoSeleccionado(null);
  };

  const cerrarModalVer = () => {
    setOpenModal(false);
    setPagoSeleccionado(null);
  };

  // ELIMINAR PAGO
  const handleEliminarPago = async (pago) => {
    const result = await Swal.fire({
      title: `¿Eliminar pago #${pago.idPago}?`,
      text: `"${pago.Descripcion || pago.TipoPago}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      const { success } = await eliminarPago(pago.idPago);
      if (success) {
        Swal.fire("Eliminado", "El pago ha sido eliminado.", "success");
        refrescarLista();
      } else {
        Swal.fire("Error", "No se pudo eliminar el pago.", "error");
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
              Cargando pagos...
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
                <h5 className="card-title mb-0">Gastos / Pagos</h5>
                <button
                  type="button"
                  className="btn btn-primary btn-agregar"
                  onClick={abrirModalAgregar}
                >
                  Agregar nuevo Pago
                </button>
              </div>

              {(!pagos || pagos.pagos?.length === 0) ? (
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    No hay pagos registrados. ¡Agrega tu primer gasto!
                  </div>
                </div>
              ) : (
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="table-id">ID</th>
                          <th>Fecha</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Medio</th>
                          <th>Monto</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.map((pago) => (
                          <tr key={pago.idPago}>
                            <td className="table-id">{pago.idPago}</td>
                            <td>{new Date(pago.FechaPago).toLocaleDateString("es-AR")}</td>
                            <td className="fw-bold">{pago.Descripcion?.substring(0, 50) || "Sin descripción"}...</td>
                            <td>{pago.TipoPago}</td>
                            <td>{pago.MedioPago}</td>
                            <td className="text-danger fw-bold">
                              ${parseFloat(pago.MontoPago).toLocaleString("es-AR")}
                            </td>
                            <td>
                              <span className={`badge ${pago.EstadoPago === "Pagado" ? "bg-success" : "bg-danger"} rounded-pill px-2`}>
                                {pago.EstadoPago.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="action-buttons">
                                <button className="btn btn-info btn-sm btn-action" title="Ver" onClick={() => verPago(pago)}>
                                  Ver
                                </button>
                                <button className="btn btn-primary btn-sm btn-action" title="Editar" onClick={() => abrirModalEditar(pago)}>
                                  Editar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm btn-action"
                                  title="Eliminar"
                                  onClick={() => handleEliminarPago(pago)}
                                >
                                  Eliminar
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

      {/* MODAL VER PAGO */}
      {openModal && pagoSeleccionado && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h5 className="modal-title fw-bold">Pago #{pagoSeleccionado.idPago}</h5>
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
                <p><strong>Fecha:</strong> {new Date(pagoSeleccionado.FechaPago).toLocaleDateString("es-AR")}</p>
                <p><strong>Descripción:</strong> {pagoSeleccionado.Descripcion || "Sin descripción"}</p>
                <p><strong>Tipo de Pago:</strong> {pagoSeleccionado.TipoPago}</p>
                <p><strong>Medio de Pago:</strong> {pagoSeleccionado.MedioPago}</p>
                <p><strong>Monto:</strong> 
                  <span className="text-danger fw-bold">
                    ${parseFloat(pagoSeleccionado.MontoPago).toLocaleString("es-AR")}
                  </span>
                </p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ${pagoSeleccionado.EstadoPago === "Pagado" ? "bg-success" : "bg-danger"}`}>
                    {pagoSeleccionado.EstadoPago.toUpperCase()}
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
                  {pagoSeleccionado ? "Editar Pago" : "Agregar Nuevo Pago"}
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
                <FormPagos
                  pago={pagoSeleccionado}
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

export default Pagos;