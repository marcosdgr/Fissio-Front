import React, { useState, useEffect } from "react";
import FormFaqs from "./FormFaqs";
import FormCategoria from "./FormCategoria";
import useCustomFaqs from "../../../Custom/useCustomFaqs";
import Swal from "sweetalert2";
import { toast } from "sonner";
import "../../../Css/Faqs/FAQs.css";

const FAQs = () => {
  const {
    faqs,
    loading,
    error,
    obtenerFaqs,
    eliminarFaq,
    desactivarCategoria,
  } = useCustomFaqs();

  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openFormCategoriaModal, setOpenFormCategoriaModal] = useState(false);
  const [categoriaSeleccionada, setCategoriasSeleccionada] = useState(null);
  const [faqSeleccionada, setFaqSeleccionada] = useState(null);
  const [listaFaqs, setListaFaqs] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);

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

  const cerrarModalVer = () => {
    setOpenModal(false);
    setFaqSeleccionada(null);
  };

  const abrirModalAgregarCategoria = () => {
    setCategoriasSeleccionada(null);
    setOpenFormCategoriaModal(true);
  };

  const abrirModalEditarCategoria = (categoria) => {
    setCategoriasSeleccionada(categoria);
    setOpenFormCategoriaModal(true);
  };

  const cerrarModalFormCategoria = () => {
    setOpenFormCategoriaModal(false);
    setCategoriasSeleccionada(null);
  };

  const handleCambiarEstadoFaq = async (idFAQ) => {
    const faq = listaFaqs.find(f => f.idFAQ === idFAQ);
    const nuevoEstado = faq.IsActive ? 0 : 1;
    const accion = faq.IsActive ? "desactivar" : "activar";

    // Si intenta activar, verificar que la categoría esté activa
    if (nuevoEstado === 1) {
      const categoriaFaq = listaCategorias.find(c => c.idCatFAQ === faq.idCatFAQ);
      if (categoriaFaq && !categoriaFaq.IsActive) {
        toast.error("No puedes activar una FAQ cuya categoría está desactivada. Activa primero la categoría.");
        return;
      }
    }

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
      const res = await eliminarFaq(idFAQ, nuevoEstado);
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

  const handleCambiarEstadoCat = async (cat) => {
    const nuevoEstado = cat.IsActive ? 0 : 1;
    const accion = cat.IsActive ? "desactivar" : "activar";
    const faqsEnCategoria = listaFaqs.filter(f => f.idCatFAQ === cat.idCatFAQ && f.IsActive);

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} categoría?`,
      text: nuevoEstado === 0 && faqsEnCategoria.length > 0
        ? `"${cat.NombreCategoria}" y sus ${faqsEnCategoria.length} pregunta(s) frecuente(s) será(n) desactivada(s).`
        : `"${cat.NombreCategoria}" será ${nuevoEstado ? "activada" : "desactivada"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const res = await desactivarCategoria(cat.idCatFAQ, nuevoEstado);
      if (res.success) {
        setListaCategorias(prev =>
          prev.map(c =>
            c.idCatFAQ === cat.idCatFAQ
              ? { ...c, IsActive: nuevoEstado }
              : c
          )
        );
        
        // Si se está desactivando, desactivar todas las FAQs de esa categoría
        if (nuevoEstado === 0) {
          setListaFaqs(prev =>
            prev.map(f =>
              f.idCatFAQ === cat.idCatFAQ
                ? { ...f, IsActive: 0 }
                : f
            )
          );
        }
        
        toast.success(`Categoría ${nuevoEstado ? "activada" : "desactivada"}`);
      } else {
        toast.error("Error al cambiar estado");
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
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Categorías de FAQs</h5>
                  <button className="btn btn-primary btn-agregar" onClick={abrirModalAgregarCategoria}>
                    Agregar nueva categoría
                  </button>
                </div>
                <div className="card-body">
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
                              <span className="fw-medium">{cat.NombreCategoria}</span>
                            </td>
                            <td>
                              <span className={`badge ${cat.IsActive ? "badge-activa" : "badge-inactiva"}`}>
                                {cat.IsActive ? "ACTIVA" : "INACTIVA"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {cat.IsActive ? (
                                  <>
                                    <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => abrirModalEditarCategoria(cat)}>
                                      <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" title="Desactivar" onClick={() => handleCambiarEstadoCat(cat)}>
                                      <span className="material-symbols-outlined">block</span>
                                    </button>
                                  </>
                                ) : (
                                  <button className="btn btn-sm btn-outline-success" title="Activar" onClick={() => handleCambiarEstadoCat(cat)}>
                                    <span className="material-symbols-outlined">check_circle</span>
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
                                <div className="d-flex gap-2 justify-content-center">
                                  <button className="btn btn-sm btn-outline-info" title="Ver" onClick={() => verFaq(faq)}>
                                    <span className="material-symbols-outlined">visibility</span>
                                  </button>
                                  <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => abrirModalEditar(faq)}>
                                    <span className="material-symbols-outlined">edit</span>
                                  </button>
                                  <button
                                    className={`btn btn-sm ${faq.IsActive ? "btn-outline-danger" : "btn-outline-success"}`}
                                    title={faq.IsActive ? "Desactivar" : !listaCategorias.find(c => c.idCatFAQ === faq.idCatFAQ)?.IsActive ? "No puedes activar (categoría desactivada)" : "Activar"}
                                    onClick={() => handleCambiarEstadoFaq(faq.idFAQ)}
                                    disabled={!faq.IsActive && !listaCategorias.find(c => c.idCatFAQ === faq.idCatFAQ)?.IsActive}
                                  >
                                    <span className="material-symbols-outlined">{faq.IsActive ? "block" : "check_circle"}</span>
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
            </>
          )}
        </div>
      </div>
      {openModal && faqSeleccionada && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h5 className="modal-title fw-bold">{faqSeleccionada.Pregunta}</h5>
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
                <p><strong>Respuesta:</strong></p>
                <div className="bg-light p-4 rounded mb-3 border">{faqSeleccionada.Respuesta}</div>
                <p><strong>Categoría:</strong> {faqSeleccionada.NombreCategoria || "Sin categoría"}</p>
                <p><strong>Fecha:</strong> {new Date(faqSeleccionada.FechaCreacion).toLocaleDateString("es-AR")}</p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ${faqSeleccionada.IsActive ? "bg-success" : "bg-danger"}`}>
                    {faqSeleccionada.IsActive ? "ACTIVA" : "INACTIVA"}
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
                  {faqSeleccionada ? "Editar FAQ" : "Agregar Nueva FAQ"}
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
                <FormFaqs
                  faq={faqSeleccionada}
                  categorias={faqSeleccionada ? listaCategorias : listaCategorias.filter(c => c.IsActive)}
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
      {openFormCategoriaModal && (
        <div className="custom-modal fade-in">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white position-relative">
                <h1 className="modal-title fs-5 fw-bold">
                  {categoriaSeleccionada ? "Editar Categoría" : "Agregar Nueva Categoría"}
                </h1>
                <button
                  type="button"
                  className="btn-close-modal-x"
                  onClick={cerrarModalFormCategoria}
                  aria-label="Cerrar formulario"
                  title="Cerrar sin guardar"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body p-4">
                <FormCategoria
                  categoria={categoriaSeleccionada}
                  onSuccess={() => {
                    refrescarLista();
                    cerrarModalFormCategoria();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {(openFormModal || openModal || openFormCategoriaModal) && <div className="modal-backdrop-custom fade-in"></div>}
    </>
  );
};

export default FAQs;