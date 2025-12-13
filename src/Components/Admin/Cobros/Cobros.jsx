import React, { useState, useEffect } from "react";
import FormCobros from "./FormCobros";
import useCustomCobros from "../../../Custom/useCustomCobros";
import useCustomPacientesCobros from "../../../Custom/useCustomPacientesCobros";
import Swal from "sweetalert2";
import "../../../Css/Cobros/Cobros.css";

const Cobros = () => {
  const { cobros, loading, error, marcarInactivo, obtenerCobros } = useCustomCobros();
  const { pacientesObj } = useCustomPacientesCobros();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [cobroSeleccionado, setCobroSeleccionado] = useState(null);

  const [busquedaDNI, setBusquedaDNI] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("desc");
  const [paginaActual, setPaginaActual] = useState(1);
  const cobrosPorPagina = 10;

  const [cobrosFiltrados, setCobrosFiltrados] = useState([]);
  const [cobrosActuales, setCobrosActuales] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    let resultado = (cobros.cobros || []).slice();

    if (busquedaDNI.trim()) {
      resultado = resultado.filter(cobro => {
        const paciente = pacientesObj.pacientes.find(p => 
          `${p.NombrePaciente} ${p.ApellidoPaciente}` === cobro.Paciente
        );
        return paciente && paciente.DNI.includes(busquedaDNI.trim());
      });
    }

    resultado.sort((a, b) => {
      const fechaA = new Date(a.FechaCobro);
      const fechaB = new Date(b.FechoCobro);
      return ordenFecha === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });

    setCobrosFiltrados(resultado);
  }, [cobros.cobros, busquedaDNI, ordenFecha, pacientesObj.pacientes]);

  useEffect(() => {
    const totalPags = Math.ceil(cobrosFiltrados.length / cobrosPorPagina);
    setTotalPaginas(totalPags);

    const indiceInicio = (paginaActual - 1) * cobrosPorPagina;
    const indiceFin = indiceInicio + cobrosPorPagina;
    const cobrosParaMostrar = cobrosFiltrados.slice(indiceInicio, indiceFin);
    
    setCobrosActuales(cobrosParaMostrar);
  }, [cobrosFiltrados, paginaActual, cobrosPorPagina]);

  const handleBusquedaChange = (valor) => {
    setBusquedaDNI(valor);
    setPaginaActual(1);
  };

  const handleOrdenChange = (orden) => {
    setOrdenFecha(orden);
    setPaginaActual(1);
  };

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

  const handleCambiarEstado = async (cobro) => {
    const esInactivo = cobro.EstadoCobro === "Inactivo";
    const accion = esInactivo ? "activar" : "desactivar";
    const nuevoEstado = esInactivo ? "ACTIVO" : "INACTIVO";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} cobro?`,
      text: `$${cobro.MontoCobro} - ${cobro.Paciente} será ${nuevoEstado}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: esInactivo ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const respuesta = await marcarInactivo(cobro);
      if (respuesta.success) {
        const mensajeEstado = esInactivo ? "activado" : "desactivado";
        Swal.fire("Éxito", `El cobro fue ${mensajeEstado}.`, "success");
        refrescarLista();
      } else {
        Swal.fire("Error", respuesta.error || "No se pudo cambiar el estado", "error");
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
                <div className="d-flex gap-3 align-items-center">
                  <h5 className="card-title mb-0">Cobros</h5>
                </div>
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
                <>
                  <div className="card-body pb-2">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Buscar por DNI</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese DNI del paciente..."
                          value={busquedaDNI}
                          onChange={(e) => handleBusquedaChange(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">Ordenar por Fecha</label>
                        <select
                          className="form-select"
                          value={ordenFecha}
                          onChange={(e) => handleOrdenChange(e.target.value)}
                        >
                          <option value="desc">Más reciente primero</option>
                          <option value="asc">Más antiguo primero</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <div className="text-muted small">
                          Mostrando {cobrosActuales.length} de {cobrosFiltrados.length} cobros
                        </div>
                      </div>
                    </div>
                  </div>

                  {cobrosFiltrados.length === 0 ? (
                    <div className="card-body">
                      <div className="alert alert-warning" role="alert">
                        No se encontraron cobros con ese DNI.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>ID</th>
                                <th>DNI</th>
                                <th>Fecha</th>
                                <th>Paciente</th>
                                <th>Monto</th>
                                <th>Medio</th>
                                <th>Estado</th>
                                <th className="text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cobrosActuales.map((cobro) => {
                                const paciente = pacientesObj.pacientes.find(p => 
                                  `${p.NombrePaciente} ${p.ApellidoPaciente}` === cobro.Paciente
                                );
                                const esInactivo = cobro.EstadoCobro === "Inactivo";
                                return (
                                  <tr key={cobro.idCobro} className={esInactivo ? "opacity-50" : ""}>
                                    <td className="fw-bold text-muted small">{cobro.idCobro}</td>
                                    <td className="fw-bold">{paciente?.DNI || '—'}</td>
                                    <td>{new Date(cobro.FechaCobro).toLocaleDateString("es-AR")}</td>
                                    <td className="fw-bold">{cobro.Paciente}</td>
                                    <td className="text-success fw-bold">${cobro.MontoCobro}</td>
                                    <td>{cobro.MedioPago}</td>
                                    <td>
                                      <span className={`badge ${
                                        cobro.EstadoCobro === "Inactivo" ? "bg-secondary" :
                                        cobro.EstadoCobro === "Cobrado" ? "bg-success" : 
                                        "bg-warning"
                                      } rounded-pill px-2`}>
                                        {cobro.EstadoCobro === "Inactivo" ? "INACTIVO" :
                                         cobro.EstadoCobro === "Cobrado" ? "PAGADO" : "PENDIENTE"}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => verCobro(cobro)}>
                                          <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => abrirModalEditar(cobro)}>
                                          <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button 
                                          className={`btn btn-sm ${cobro.EstadoCobro === "Inactivo" ? "btn-outline-success" : "btn-outline-danger"}`}
                                          title={cobro.EstadoCobro === "Inactivo" ? "Activar" : "Desactivar"}
                                          onClick={() => handleCambiarEstado(cobro)}
                                        >
                                          <span className="material-symbols-outlined">{cobro.EstadoCobro === "Inactivo" ? "check_circle" : "block"}</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
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