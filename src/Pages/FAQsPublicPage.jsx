import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCustomFaqs from "../Custom/useCustomFaqs"; // TU MISMO HOOK
import "../Css/PacienteFAQs/FAQsPublicPage.css";

const FAQsPublicPage = () => {
  const { faqs, loading, error } = useCustomFaqs();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [openIndex, setOpenIndex] = useState(null);

  // Filtrar solo FAQs y categorías activas
  const faqsActivas = (faqs?.faqs || [])
    .filter(f => f.IsActive)
    .sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion));

  const categoriasActivas = (faqs?.categorias || []).filter(c => c.IsActive);

  const faqsFiltradas = faqsActivas.filter(faq => {
    const coincideCategoria = categoriaFiltro === "todas" || faq.idCatFAQ === parseInt(categoriaFiltro);
    const coincideBusqueda = 
      faq.Pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.Respuesta.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const toggleAcordeon = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    document.title = "Preguntas Frecuentes | Fissio";
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="public-header">
        <div className="container">
          <Link to="/" className="logo">Fissio</Link>
          <nav className="public-nav">
            <Link to="/">Inicio</Link>
            <Link to="/servicios">Servicios</Link>
            <Link to="/faqs" className="active">Preguntas Frecuentes</Link>
            <Link to="/turnos">Turnos</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="faqs-hero">
        <div className="carousel-overlay"></div>
        <div className="container">
          <div className="carousel-caption">
            <h1 className="carousel-title">Preguntas Frecuentes</h1>
            <p className="carousel-subtitle">Respondemos todas tus dudas</p>
            <p className="carousel-description">
              Tratamientos, turnos, pagos, horarios y más
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="faqs-section py-5">
        <div className="container">
          {/* BUSCADOR + FILTRO */}
          <div className="faqs-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar pregunta o respuesta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {categoriasActivas.map(cat => (
                <option key={cat.idCatFAQ} value={cat.idCatFAQ}>
                  {cat.NombreCategoria}
                </option>
              ))}
            </select>
          </div>

          {/* ESTADOS */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando preguntas frecuentes...</p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <p className="text-danger">Error al cargar las FAQs. Intenta más tarde.</p>
            </div>
          )}

          {!loading && !error && faqsFiltradas.length === 0 && (
            <div className="empty-state">
              <p className="text-muted">No se encontraron preguntas con ese criterio.</p>
            </div>
          )}

          {/* ACORDEÓN */}
          {!loading && !error && faqsFiltradas.length > 0 && (
            <div className="faqs-accordion">
              {faqsFiltradas.map((faq, index) => (
                <div
                  key={faq.idFAQ}
                  className={`faq-card ${openIndex === index ? "active" : ""}`}
                  onClick={() => toggleAcordeon(index)}
                >
                  <div className="faq-header">
                    <h3 className="faq-question">{faq.Pregunta}</h3>
                    <span className="toggle-icon">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </div>
                  <div className="faq-body">
                    <div className="faq-content">
                      <p>{faq.Respuesta}</p>
                      {faq.NombreCategoria && (
                        <span className="category-pill">
                          {faq.NombreCategoria}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA FINAL */}
          <div className="faq-cta">
            <div className="turno-icon">
              <i className="bi bi-chat-dots-fill"></i>
            </div>
            <h3 className="turno-title">¿No encontraste tu respuesta?</h3>
            <p className="turno-description">
              Hablá con nosotros por WhatsApp o sacá turno online
            </p>
            <div className="turno-buttons-container">
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="turno-btn-primary"
              >
                Chatear por WhatsApp
              </a>
              <Link to="/turnos" className="turno-btn-primary ms-3">
                Sacar Turno
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQsPublicPage;