import React from "react";

const CarruselHome = () => {
  const slides = [
    {
      id: 1,
      title: "Centro de Kinesiología Fissio",
      subtitle: "Atención profesional para tu bienestar",
      description: "Especialistas en rehabilitación y prevención con tratamientos personalizados",
      imageUrl: "/hero-imagen-1.jpg", // Colocar imágenes en public/
      ctaText: "Conocer más",
      ctaLink: "/servicios"
    },
    {
      id: 2,
      title: "Recuperación y Rehabilitación",
      subtitle: "Tecnología avanzada al servicio de tu salud",
      description: "Equipamiento moderno y técnicas innovadoras para tu mejor recuperación",
      imageUrl: "/hero-imagen-2.jpg",
      ctaText: "Ver servicios",
      ctaLink: "/servicios"
    },
    {
      id: 3,
      title: "Agenda tu Turno",
      subtitle: "Atención personalizada cuando lo necesites",
      description: "Horarios flexibles y profesionales dedicados a tu recuperación",
      imageUrl: "/hero-imagen-3.jpg",
      ctaText: "Pedir turno",
      ctaLink: "/turnos"
    }
  ];

  return (
    <div id="fissioCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button 
            key={index}
            type="button" 
            data-bs-target="#fissioCarousel" 
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="carousel-image-container">
              <img 
                src={slide.imageUrl} 
                className="d-block w-100 carousel-image" 
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="carousel-overlay"></div>
            </div>
            <div className="carousel-caption d-flex flex-column justify-content-center h-100">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12 col-lg-8 text-center">
                    <h1 className="carousel-title display-4 fw-bold mb-3" data-aos="fade-up">
                      {slide.title}
                    </h1>
                    <h2 className="carousel-subtitle h4 mb-3" data-aos="fade-up" data-aos-delay="200">
                      {slide.subtitle}
                    </h2>
                    <p className="carousel-description lead mb-4" data-aos="fade-up" data-aos-delay="400">
                      {slide.description}
                    </p>
                    <div data-aos="fade-up" data-aos-delay="600">
                      <a href={slide.ctaLink} className="btn btn-primary btn-lg carousel-cta">
                        {slide.ctaText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#fissioCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#fissioCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default CarruselHome;
