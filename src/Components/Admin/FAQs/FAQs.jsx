import React, { useState, useEffect } from "react";
import FormFaqs from "./FormFaqs";
import useCustomFaqs from "../../../Custom/useCustomFaqs";
import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "../../../Api/api";
import "../../../Css/Faqs/FAQs.css";

const FAQs = () => {
  const {
    faqs,
    loading,
    error,
    obtenerFaqs,
    eliminarFaq,
    editarCategoria,
    desactivarCategoria,
  } = useCustomFaqs();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [faqSeleccionada, setFaqSeleccionada] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editandoCat, setEditandoCat] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [listaFaqs, setListaFaqs] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);

  // Sincronizar datos del hook
  useEffect(() => {
    if (faqs?.faqs) {
      const ordenadas = [...faqs.faqs].sort(
        (a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion)
      );
      setListaFaqs(ordenadas);
    }
    if (faqs?.categorias) {
      setListaCategorias(faqs.categorias);
    }
  }, [faqs]);

  const refrescarLista = async () => {
    await obtenerFaqs();
  };

  const verFaq = (faq) => {
    setFaqSeleccionada(faq);
    setOpenModal(true);
  };

  const abrirModalAgregar = () => {
    setFaqSeleccionada(null);
    setOpenFormModal(true);
  };

  const abrirModalEditar = (faq) => {
    setFaqSeleccionada(faq);
    setOpenFormModal(true);
  };

  const cerrarModalForm = () => {
    setOpenFormModal(false);
    setFaqSeleccionada(null);
  };

  // TOGGLE FAQ (sin eliminar)
  const handleCambiarEstadoFaq = async (idFAQ) => {
    const faq = listaFaqs.find(f => f.idFAQ === idFAQ);
    const nuevoEstado = faq.IsActive ? 0 : 1;
    const accion = faq.IsActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} FAQ?`,
      text: `"${faq.Pregunta.substring(0, 50)}..." será ${nuevoEstado ? "activada" : "desactivada"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const res = await eliminarFaq(idFAQ);
      if (res.success) {
        setListaFaqs(prev =>
          prev.map(f =>
            f.idFAQ === idFAQ ? { ...f, IsActive: nuevoEstado } : f
          )
        );
        toast.success(`FAQ ${nuevoEstado ? "activada" : "desactivada"}`);
      } else {
        toast.error("Error al cambiar estado");
      }
    }
  };

  // TOGGLE CATEGORÍA (sin recargar ni desaparecer)
  const handleCambiarEstadoCat = async (cat) => {
    const nuevoEstado = cat.IsActive ? 0 : 1;
    const accion = cat.IsActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} categoría?`,
      text: `"${cat.NombreCategoria}" será ${nuevoEstado ? "activada" : "desactivada"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const res = await desactivarCategoria(cat.idCatFAQ);
      if (res.success) {
        setListaCategorias(prev =>
          prev.map(c =>
            c.idCatFAQ === cat.idCatFAQ
              ? { ...c, IsActive: nuevoEstado }
              : c
          )
        );
        toast.success(`Categoría ${nuevoEstado ? "activada" : "desactivada"}`);
      } else {
        toast.error("Error al cambiar estado");
      }
    }
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      await axios.post(`${BASE_URL}api/cat-faqs/v1`, { NombreCategoria: nuevaCategoria });
      toast.success("Categoría creada");
      setNuevaCategoria("");
      refrescarLista();
    } catch (err) {
      toast.error("Error al crear categoría");
    }
  };

  const iniciarEdicion = (cat) => {
    setEditandoCat(cat.idCatFAQ);
    setNombreEditado(cat.NombreCategoria);
  };

  const guardarEdicion = async (id) => {
    if (!nombreEditado.trim()) return;
    const res = await editarCategoria(id, { NombreCategoria: nombreEditado });
    if (res.success) {
      toast.success("Categoría actualizada");
      setEditandoCat(null);
      refrescarLista();
    } else {
      toast.error(res.error);
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
              Cargando FAQs y categorías...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* TABLA FAQs */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Preguntas Frecuentes</h5>
                  <button className="btn btn-primary btn-agregar" onClick={abrirModalAgregar}>
                    Agregar nueva FAQ
                  </button>
                </div>

                {listaFaqs.length === 0 ? (
                  <div className="card-body text-center py-5">
                    <div className="alert alert-info">
                      No hay FAQs disponibles. ¡Agrega tu primera pregunta!
                    </div>
                  </div>
                ) : (
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="table-id">ID</th>
                            <th>Pregunta</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listaFaqs.map((faq) => (
                            <tr
                              key={faq.idFAQ}
                              className={!faq.IsActive ? "faq-inactiva" : ""}
                            >
                              <td className="table-id">{faq.idFAQ}</td>
                              <td className="fw-bold">{faq.Pregunta.substring(0, 50)}...</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {faq.NombreCategoria || "Sin categoría"}
                                </span>
                              </td>
                              <td>{new Date(faq.FechaCreacion).toLocaleDateString("es-AR")}</td>
                              <td>
                                <span className={`badge ${faq.IsActive ? "badge-activa" : "badge-inactiva"}`}>
                                  {faq.IsActive ? "ACTIVA" : "INACTIVA"}
                                </span>
                              </td>
                              <td className="text-center">
                                <div className="action-buttons">
                                  <button className="btn btn-ver" onClick={() => verFaq(faq)}>
                                    Ver
                                  </button>
                                  <button className="btn btn-editar" onClick={() => abrirModalEditar(faq)}>
                                    Editar
                                  </button>
                                  <button
                                    className={`btn ${faq.IsActive ? "btn-desactivar" : "btn-activar"}`}
                                    onClick={() => handleCambiarEstadoFaq(faq.idFAQ)}
                                  >
                                    {faq.IsActive ? "Desactivar" : "Activar"}
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

              {/* CATEGORÍAS */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Categorías de FAQs</h5>
                </div>
                <div className="card-body">
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nueva categoría..."
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && crearCategoria()}
                    />
                    <button className="btn btn-primary" onClick={crearCategoria}>
                      Agregar
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaCategorias.map((cat) => (
                          <tr
                            key={cat.idCatFAQ}
                            className={!cat.IsActive ? "cat-inactiva" : ""}
                          >
                            <td>{cat.idCatFAQ}</td>
                            <td>
                              {editandoCat === cat.idCatFAQ ? (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={nombreEditado}
                                  onChange={(e) => setNombreEditado(e.target.value)}
                                  onBlur={() => guardarEdicion(cat.idCatFAQ)}
                                  onKeyDown={(e) => e.key === "Enter" && guardarEdicion(cat.idCatFAQ)}
                                  autoFocus
                                />
                              ) : (
                                <span className="fw-medium">{cat.NombreCategoria}</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${cat.IsActive ? "badge-activa" : "badge-inactiva"}`}>
                                {cat.IsActive ? "ACTIVA" : "INACTIVA"}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                {cat.IsActive ? (
                                  <>
                                    <button className="btn btn-editar btn-sm" onClick={() => iniciarEdicion(cat)}>
                                      Editar
                                    </button>
                                    <button className="btn btn-desactivar btn-sm" onClick={() => handleCambiarEstadoCat(cat)}>
                                      Desactivar
                                    </button>
                                  </>
                                ) : (
                                  <button className="btn btn-activar btn-sm" onClick={() => handleCambiarEstadoCat(cat)}>
                                    Activar
                                  </button>
                                )}
                              </div>
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

      {/* MODAL VER */}
      {openModal && faqSeleccionada && (
        <div className="custom-modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{faqSeleccionada.Pregunta}</h5>
                <button type="button" className="btn-close" onClick={() => setOpenModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Respuesta:</strong></p>
                <div className="bg-light p-4 rounded mb-3 border">{faqSeleccionada.Respuesta}</div>
                <p><strong>Categoría:</strong> {faqSeleccionada.NombreCategoria || "Sin categoría"}</p>
                <p><strong>Fecha:</strong> {new Date(faqSeleccionada.FechaCreacion).toLocaleDateString("es-AR")}</p>
                <p><strong>Estado:</strong> <span className={`badge ${faqSeleccionada.IsActive ? "bg-success" : "bg-danger"}`}>
                  {faqSeleccionada.IsActive ? "ACTIVA" : "INACTIVA"}
                </span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {openFormModal && (
        <div className="custom-modal">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">
                  {faqSeleccionada ? "Editar FAQ" : "Agregar Nueva FAQ"}
                </h1>
                <button type="button" className="btn-close" onClick={cerrarModalForm}></button>
              </div>
              <div className="modal-body">
                <FormFaqs
                  faq={faqSeleccionada}
                  categorias={listaCategorias.filter(c => c.IsActive)}
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

      {/* BACKDROP */}
      {(openFormModal || openModal) && <div className="modal-backdrop-custom"></div>}
    </>
  );
};

export default FAQs;