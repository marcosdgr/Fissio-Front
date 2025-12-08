import React from "react";
import CarruselHome from "../Components/Home/CarruselHome";
import CardServiciosHome from "../Components/Home/CardServiciosHome";
import CardComentariosHome from "../Components/Home/CardComentariosHome";
import TurnoHome from "../Components/Home/TurnoHome";
import Chatbot from "../Components/BOT/Chatbot.jsx";
import "../Css/Home/Home.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Sección Hero con Carrusel */}
      <section className="hero-section">
        <CarruselHome />
      </section>

      {/* Sección de Servicios */}
      <section className="servicios-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="section-title text-center">Nuestros Servicios</h2>
              <p className="section-subtitle text-center">
                Tratamientos profesionales para tu recuperación y bienestar
              </p>
            </div>
          </div>
        </div>
        <CardServiciosHome />
      </section>

      {/* Sección de Comentarios/Testimonios */}
      <section className="comentarios-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2 className="section-title text-center">Lo que dicen nuestros pacientes</h2>
              <p className="section-subtitle">
                Testimonios reales de personas que confiaron en nosotros
              </p>
            </div>
          </div>
          <CardComentariosHome />
        </div>
      </section>
      {/* Sección CTA - Agendar Turno */}
      <section className="turno-section">
        <TurnoHome />
      </section>
      <Chatbot />
    </div>
  );
};

export default HomePage;
