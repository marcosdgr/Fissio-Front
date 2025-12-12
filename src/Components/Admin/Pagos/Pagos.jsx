import React, { useState, useMemo } from "react";
import FormPagos from "./FormPagos";
import useCustomPagos from "../../../Custom/useCustomPagos";
import useCustomCatPagos from "../../../Custom/useCustomCatPagos";
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

  const { tiposPago } = useCustomCatPagos();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [ordenMonto, setOrdenMonto] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("desc"); 
  const [paginaActual, setPaginaActual] = useState(1);
  const pagosPorPagina = 10;

  const pagosFiltrados = useMemo(() => {
    let resultado = (pagos.pagos || []).slice();

    if (categoriaFiltro) {
      resultado = resultado.filter(pago => pago.TipoPago === categoriaFiltro);
    }

    resultado.sort((a, b) => {
      if (ordenMonto) {
        const montoA = parseFloat(a.MontoPago);
        const montoB = parseFloat(b.MontoPago);
        const comparacionMonto = ordenMonto === "asc" ? montoA - montoB : montoB - montoA;
        if (comparacionMonto !== 0) return comparacionMonto;
      }

      const fechaA = new Date(a.FechaPago);
      const fechaB = new Date(b.FechaPago);
      return ordenFecha === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });

    return resultado;
  }, [pagos.pagos, categoriaFiltro, ordenMonto, ordenFecha]);

  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);
  const indiceInicio = (paginaActual - 1) * pagosPorPagina;
  const indiceFin = indiceInicio + pagosPorPagina;
  const pagosActuales = pagosFiltrados.slice(indiceInicio, indiceFin);

  const handleCategoriaChange = (valor) => {
    setCategoriaFiltro(valor);
    setPaginaActual(1);
  };

  const handleOrdenMontoChange = (orden) => {
    setOrdenMonto(orden);
    setPaginaActual(1);
  };

  const handleOrdenFechaChange = (orden) => {
    setOrdenFecha(orden);
    setPaginaActual(1);
  };

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
                <>
                  <div className="card-body pb-2">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label className="form-label fw-bold">Filtrar por Categoría</label>
                        <select
                          className="form-select"
                          value={categoriaFiltro}
                          onChange={(e) => handleCategoriaChange(e.target.value)}
                        >
                          <option value="">Todas las categorías</option>
                          {tiposPago && tiposPago.length > 0 && tiposPago.map(tipo => (
                            <option key={tipo.idTipoPago} value={tipo.NombreTipo}>
                              {tipo.NombreTipo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold">Ordenar por Monto</label>
                        <select
                          className="form-select"
                          value={ordenMonto}
                          onChange={(e) => handleOrdenMontoChange(e.target.value)}
                        >
                          <option value="">Sin ordenar por monto</option>
                          <option value="desc">Mayor a menor</option>
                          <option value="asc">Menor a mayor</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold">Ordenar por Fecha</label>
                        <select
                          className="form-select"
                          value={ordenFecha}
                          onChange={(e) => handleOrdenFechaChange(e.target.value)}
                        >
                          <option value="desc">Más reciente primero</option>
                          <option value="asc">Más antiguo primero</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <div className="text-muted small">
                          Mostrando {pagosActuales.length} de {pagosFiltrados.length} pagos
                        </div>
                      </div>
                    </div>
                  </div>

                  {pagosFiltrados.length === 0 ? (
                    <div className="card-body">
                      <div className="alert alert-warning" role="alert">
                        No se encontraron pagos con los filtros seleccionados.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                              <tr>
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
                              {pagosActuales.map((pago) => (
                                <tr key={pago.idPago}>
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
                                    <div className="d-flex gap-2 justify-content-center">
                                      <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => verPago(pago)}>
                                        <span className="material-symbols-outlined">visibility</span>
                                      </button>
                                      <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => abrirModalEditar(pago)}>
                                        <span className="material-symbols-outlined">edit</span>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        title="Eliminar"
                                        onClick={() => handleEliminarPago(pago)}
                                      >
                                        <span className="material-symbols-outlined">block</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {totalPaginas > 1 && (
                        <div className="card-footer bg-white border-top">
                          <nav>
                            <ul className="pagination justify-content-center mb-0">
                              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setPaginaActual(paginaActual - 1)}
                                  disabled={paginaActual === 1}
                                >
                                  Anterior
                                </button>
                              </li>
                              
                              {[...Array(totalPaginas)].map((_, index) => {
                                const pagina = index + 1;
                                if (
                                  pagina === 1 ||
                                  pagina === totalPaginas ||
                                  (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
                                ) {
                                  return (
                                    <li key={pagina} className={`page-item ${paginaActual === pagina ? 'active' : ''}`}>
                                      <button 
                                        className="page-link" 
                                        onClick={() => setPaginaActual(pagina)}
                                      >
                                        {pagina}
                                      </button>
                                    </li>
                                  );
                                } else if (
                                  pagina === paginaActual - 2 ||
                                  pagina === paginaActual + 2
                                ) {
                                  return <li key={pagina} className="page-item disabled"><span className="page-link">...</span></li>;
                                }
                                return null;
                              })}
                              
                              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setPaginaActual(paginaActual + 1)}
                                  disabled={paginaActual === totalPaginas}
                                >
                                  Siguiente
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
      
      {(openFormModal || openModal) && <div className="modal-backdrop-custom fade-in"></div>}
    </>
  );
};

export default Pagos;