
import React, { useState } from "react";
import FormFaqs from "./FormFaqs";
import useCustomFaqs from "../../../Custom/useCustomFaqs";
import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "../../../Api/api";

const FAQs = () => {
  const {
    faqs,
    loading,
    error,
    obtenerFaqs,
    eliminarFaq,
    editarCategoria,
    desactivarCategoria
  } = useCustomFaqs();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [faqSeleccionada, setFaqSeleccionada] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editandoCat, setEditandoCat] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const resultado = (faqs.faqs || [])
    .slice()
    .sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion));

  const refrescarLista = async () => {
    await obtenerFaqs();
  };

  // === FAQs ===
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

  const confirmarEliminar = async (faq) => {
    const result = await Swal.fire({
      title: "¿Desactivar FAQ?",
      text: `"${faq.Pregunta.substring(0, 50)}..." ya no estará visible`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      const res = await eliminarFaq(faq.idFAQ);
      if (res.success) {
        toast.success("FAQ desactivada");
        refrescarLista();
      } else {
        toast.error(res.error);
      }
    }
  };

  // === CATEGORÍAS ===
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

  const confirmarDesactivarCat = async (cat) => {
    const result = await Swal.fire({
      title: "¿Desactivar categoría?",
      text: `"${cat.NombreCategoria}" ya no estará disponible`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      const res = await desactivarCategoria(cat.idCatFAQ);
      if (res.success) {
        toast.success("Categoría desactivada");
        refrescarLista();
      } else {
        toast.error(res.error);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">

          {/* === LOADING & ERROR === */}
          {loading && (
            <div className="alert alert-info" role="alert">
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

          {/* === FAQs + CATEGORÍAS === */}
          {!loading && !error && (
            <>
              {/* FAQs */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Preguntas Frecuentes</h5>
                  <button type="button" className="btn btn-primary" onClick={abrirModalAgregar}>
                    Agregar nueva FAQ
                  </button>
                </div>

                {faqs.faqs?.length === 0 ? (
                  <div className="card-body">
                    <div className="alert alert-info" role="alert">
                      No hay FAQs disponibles. ¡Agrega tu primera pregunta!
                    </div>
                  </div>
                ) : (
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Pregunta</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultado.map((faq) => (
                            <tr key={faq.idFAQ}>
                              <td>{faq.idFAQ}</td>
                              <td className="fw-bold">{faq.Pregunta.substring(0, 50)}...</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {faq.NombreCategoria || 'Sin categoría'}
                                </span>
                              </td>
                              <td>{new Date(faq.FechaCreacion).toLocaleDateString('es-AR')}</td>
                              <td>
                                <span className={`badge ${faq.IsActive ? 'bg-success' : 'bg-danger'}`}>
                                  {faq.IsActive ? 'ACTIVA' : 'INACTIVA'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button className="btn btn-outline-primary btn-sm" onClick={() => abrirModalEditar(faq)}>
                                    Editar
                                  </button>
                                  <button className="btn btn-outline-info btn-sm" onClick={() => verFaq(faq)}>
                                    Ver
                                  </button>
                                  {faq.IsActive && (
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => confirmarEliminar(faq)}>
                                      Desactivar
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
                )}
              </div>

              {/* CATEGORÍAS */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Categorías de FAQs</h5>
                </div>
                <div className="card-body">

                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de la nueva categoría"
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && crearCategoria()}
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
                        {faqs.categorias?.map((cat) => (
                          <tr key={cat.idCatFAQ}>
                            <td>{cat.idCatFAQ}</td>
                            <td>
                              {editandoCat === cat.idCatFAQ ? (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={nombreEditado}
                                  onChange={(e) => setNombreEditado(e.target.value)}
                                  onBlur={() => guardarEdicion(cat.idCatFAQ)}
                                  onKeyDown={(e) => e.key === 'Enter' && guardarEdicion(cat.idCatFAQ)}
                                  autoFocus
                                />
                              ) : (
                                <span className="fw-medium">{cat.NombreCategoria}</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${cat.IsActive ? 'bg-success' : 'bg-danger'}`}>
                                {cat.IsActive ? 'ACTIVA' : 'INACTIVA'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {cat.IsActive ? (
                                  <>
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => iniciarEdicion(cat)}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => confirmarDesactivarCat(cat)}
                                    >
                                      Desactivar
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-muted">Desactivada</span>
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

      {/* MODAL FAQ */}
      {openFormModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5 text-dark">
                  {faqSeleccionada ? 'Editar FAQ' : 'Agregar Nueva FAQ'}
                </h1>
                <button type="button" className="btn-close" onClick={cerrarModalForm}></button>
              </div>
              <div className="modal-body">
                <FormFaqs
                  faq={faqSeleccionada}
                  categorias={faqs.categorias?.filter(c => c.IsActive) || []}
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

      {/* MODAL VER */}
      {openModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">{faqSeleccionada?.Pregunta}</h5>
                <button type="button" className="btn-close" onClick={() => setOpenModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Respuesta:</strong></p>
                <div className="bg-light p-3 rounded mb-3">{faqSeleccionada?.Respuesta}</div>
                <p><strong>Categoría:</strong> {faqSeleccionada?.NombreCategoria || 'Sin categoría'}</p>
                <p><strong>Fecha:</strong> {new Date(faqSeleccionada?.FechaCreacion).toLocaleDateString('es-AR')}</p>
                <p><strong>Estado:</strong> <span className={`badge ${faqSeleccionada?.IsActive ? 'bg-success' : 'bg-danger'}`}>
                  {faqSeleccionada?.IsActive ? 'ACTIVA' : 'INACTIVA'}
                </span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQs;