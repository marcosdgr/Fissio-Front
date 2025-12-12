import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Api/api";
import "../../../Css/Paciente/PacienteFAQs.css";

const PacienteFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    cargarFAQs();
  }, []);

  const cargarFAQs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/faqs/public`);
      setFaqs(res.data.faqs || []);
      setCategorias(res.data.categorias || []);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando FAQs públicas", err);
      setLoading(false);
    }
  };

  // Filtro
  const faqsFiltradas = faqs
    .filter(faq => faq.IsActive)
    .filter(faq => 
      (categoriaFiltro === "todas" || faq.idCatFAQ === parseInt(categoriaFiltro)) &&
      (faq.Pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
       faq.Respuesta.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const toggleAcordeon = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="paciente-faqs-container">
        <div className="faqs-header">
          <h1 className="faqs-title">
            Preguntas Frecuentes
          </h1>
          <p className="faqs-subtitle">
            Todo lo que necesitas saber sobre nuestros servicios
          </p>
        </div>

        {/* buscador */}
        <div className="faqs-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar pregunta o respuesta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            className="categoria-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias
              .filter(cat => cat.IsActive)
              .map(cat => (
                <option key={cat.idCatFAQ} value={cat.idCatFAQ}>
                  {cat.NombreCategoria}
                </option>
              ))}
          </select>
        </div>

        {/* estado */}
        {loading ? (
          <div className="faqs-loading">
            <div className="spinner"></div>
            <p>Cargando preguntas frecuentes...</p>
          </div>
        ) : faqsFiltradas.length === 0 ? (
          <div className="faqs-empty">
            <p>No se encontraron preguntas frecuentes.</p>
          </div>
        ) : (
          <div className="faqs-list">
            {faqsFiltradas.map((faq, index) => (
              <div
                key={faq.idFAQ}
                className={`faq-item ${openIndex === index ? "open" : ""}`}
                onClick={() => toggleAcordeon(index)}
              >
                <div className="faq-question">
                  <span className="faq-icon">
                    {openIndex === index ? "−" : "+"}
                  </span>
                  <h3>{faq.Pregunta}</h3>
                </div>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p>{faq.Respuesta}</p>
                    {faq.NombreCategoria && (
                      <span className="categoria-tag">
                        {faq.NombreCategoria}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="faqs-footer">
          <p>¿No encontraste lo que buscabas?</p>
          <a href="/contacto" className="btn-contacto">
            Contáctanos
          </a>
        </div>
      </div>
    </>
  );
};

export default PacienteFAQs;