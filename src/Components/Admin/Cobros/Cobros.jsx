import React, { useState } from "react";
import FormCobros from "./FormCobros";
import useCustomCobros from "../../../Custom/useCustomCobros";
import Swal from "sweetalert2";
import "../../../Css/Cobros/Cobros.css";

const Cobros = () => {
  const { cobros, loading, error, eliminarCobro, obtenerCobros } = useCustomCobros();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);

  const resultado = (cobros.cobros || []).slice().sort((a, b) => b.idCobro - a.idCobro);

  const refrescarLista = async () => {
    await obtenerCobros();
  };

  const verCobro = (cobro) => {
    setCobroSeleccionado(cobro);
    setOpenModal(true);
  };

  const abrirModalAgregar = () => {
    setCobroSeleccionado(null);
    setOpenFormModal(true);
  };

  const abrirModalEditar = (cobro) => {
    setCobroSeleccionado(cobro);
    setOpenFormModal(true);
  };

  const cerrarModalForm = () => {
    setOpenFormModal(false);
    setCobroSeleccionado(null);
  };

  const cerrarModalVer = () => {
    setOpenModal(false);
    setCobroSeleccionado(null);
  };

  const handleEliminar = async (cobro) => {
    const result = await Swal.fire({
      title: "¿Eliminar cobro?",
      text: `$${cobro.MontoCobro} - ${cobro.Paciente}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const { success } = await eliminarCobro(cobro.idCobro);
      if (success) {
        Swal.fire("Eliminado", "El cobro fue eliminado.", "success");
        refrescarLista();
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
              Cargando cobros...
            </div>
          )}

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          {!loading && !error && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Cobros</h5>
                <button className="btn btn-primary btn-agregar" onClick={abrirModalAgregar}>
                  Registrar Cobro
                </button>
              </div>

              {(!cobros || cobros.cobros?.length === 0) ? (
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    No hay cobros registrados. ¡Registra el primero!
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
                          <th>Paciente</th>
                          <th>Monto</th>
                          <th>Medio</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.map((cobro) => (
                          <tr key={cobro.idCobro}>
                            <td className="table-id">{cobro.idCobro}</td>
                            <td>{new Date(cobro.FechaCobro).toLocaleDateString("es-AR")}</td>
                            <td className="fw-bold">{cobro.Paciente}</td>
                            <td className="text-success fw-bold">${cobro.MontoCobro}</td>
                            <td>{cobro.MedioPago}</td>
                            <td>
                              <span className={`badge ${cobro.EstadoCobro === "Cobrado" ? "bg-success" : "bg-warning"} rounded-pill px-2`}>
                                {cobro.EstadoCobro === "Cobrado" ? "PAGADO" : "PENDIENTE"}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="action-buttons">
                                <button className="btn btn-info btn-sm btn-action" title="Ver" onClick={() => verCobro(cobro)}>
                                  Ver
                                </button>
                                <button className="btn btn-primary btn-sm btn-action" title="Editar" onClick={() => abrirModalEditar(cobro)}>
                                  Editar
                                </button>
                                <button className="btn btn-danger btn-sm btn-action" title="Eliminar" onClick={() => handleEliminar(cobro)}>
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

      {/* MODAL VER */}
      {openModal && cobroSeleccionado && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h5 className="modal-title fw-bold">Cobro #{cobroSeleccionado.idCobro}</h5>
                <button type="button" className="btn-close-modal-x" onClick={cerrarModalVer}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Paciente:</strong> {cobroSeleccionado.Paciente}</p>
                <p><strong>Fecha:</strong> {new Date(cobroSeleccionado.FechaCobro).toLocaleString("es-AR")}</p>
                <p><strong>Monto:</strong> <span className="text-success fw-bold">${cobroSeleccionado.MontoCobro}</span></p>
                <p><strong>Medio de Pago:</strong> {cobroSeleccionado.MedioPago}</p>
                <p><strong>Tipo:</strong> {cobroSeleccionado.TipoCobro}</p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ${cobroSeleccionado.EstadoCobro === "Cobrado" ? "bg-success" : "bg-warning"}`}>
                    {cobroSeleccionado.EstadoCobro === "Cobrado" ? "PAGADO" : "PENDIENTE"}
                  </span>
                </p>
                {cobroSeleccionado.Descripcion && <p><strong>Descripción:</strong> {cobroSeleccionado.Descripcion}</p>}
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
                  {cobroSeleccionado ? "Editar Cobro" : "Registrar Nuevo Cobro"}
                </h1>
                <button type="button" className="btn-close-modal-x" onClick={cerrarModalForm}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body p-4">
                <FormCobros
                  cobro={cobroSeleccionado}
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

      {(openFormModal || openModal) && <div className="modal-backdrop-custom fade-in"></div>}
    </>
  );
};

export default Cobros;