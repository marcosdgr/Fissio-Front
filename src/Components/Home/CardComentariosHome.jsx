import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CardComentariosHome = () => {
  const [currentTestimonio, setCurrentTestimonio] = useState(0);

  const testimonios = [
    {
      id: 1,
      nombre: "María González",
      edad: 45,
      tratamiento: "Kinesiología General",
      rating: 5,
      comentario: "Excelente atención profesional. Me recuperé completamente de mi lesión de espalda gracias al tratamiento personalizado que recibí.",
      fecha: "Hace 2 semanas",
      avatar: "/avatar-mujer-1.jpg"
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      edad: 32,
      tratamiento: "Rehabilitación Deportiva",
      rating: 5,
      comentario: "Como futbolista amateur, necesitaba recuperarme rápido de mi lesión. El equipo de Fissio me ayudó a volver a la cancha en tiempo récord.",
      fecha: "Hace 1 mes",
      avatar: "/avatar-hombre-1.jpg"
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      edad: 38,
      tratamiento: "Reeducación Postural",
      rating: 5,
      comentario: "Después de años trabajando en oficina, tenía dolores constantes. Ahora puedo trabajar sin molestias. ¡Muy recomendable!",
      fecha: "Hace 3 semanas",
      avatar: "/avatar-mujer-2.jpg"
    },
    {
      id: 4,
      nombre: "Roberto Silva",
      edad: 58,
      tratamiento: "Kinesiología Respiratoria",
      rating: 5,
      comentario: "Mi calidad de vida mejoró notablemente. Los ejercicios respiratorios que me enseñaron los practico a diario.",
      fecha: "Hace 2 meses",
      avatar: "/avatar-hombre-2.jpg"
    },
    {
      id: 5,
      nombre: "Laura Fernández",
      edad: 29,
      tratamiento: "Terapia Manual",
      rating: 5,
      comentario: "Las técnicas manuales fueron increíbles para mi dolor cervical. Profesionales muy capacitados y empáticos.",
      fecha: "Hace 1 semana",
      avatar: "/avatar-mujer-3.jpg"
    }
  ];

  // Auto-slide cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonio((prev) => (prev + 1) % testimonios.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonios.length]);

  const nextTestimonio = () => {
    setCurrentTestimonio((prev) => (prev + 1) % testimonios.length);
  };

  const prevTestimonio = () => {
    setCurrentTestimonio((prev) => (prev - 1 + testimonios.length) % testimonios.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? "star-filled" : "star-empty"} 
      />
    ));
  };

  return (
    <div className="testimonios-container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="testimonios-carousel">
            <div className="testimonio-card-container">
              {testimonios.map((testimonio, index) => {
                let cardClass = "testimonio-card";
                if (index === currentTestimonio) {
                  cardClass += " active";
                } else if (index === (currentTestimonio - 1 + testimonios.length) % testimonios.length) {
                  cardClass += " prev";
                } else if (index === (currentTestimonio + 1) % testimonios.length) {
                  cardClass += " next";
                }

                return (
                  <div key={testimonio.id} className={cardClass}>
                    <div className="card testimonio-card-inner h-100 shadow">
                      <div className="card-body p-4">
                        <div className="quote-icon mb-3">
                          <FaQuoteLeft />
                        </div>
                        
                        <blockquote className="testimonio-texto mb-4">
                          "{testimonio.comentario}"
                        </blockquote>
                        
                        <div className="testimonio-rating mb-3">
                          {renderStars(testimonio.rating)}
                        </div>
                        
                        <div className="testimonio-autor d-flex align-items-center">
                          <div className="autor-avatar me-3">
                            <img 
                              src={testimonio.avatar} 
                              alt={testimonio.nombre}
                              className="rounded-circle"
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNBN0IxQjQiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEg2VjIwSDE4VjIwQzE4IDE2LjY4NjMgMTUuMzEzNyAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                              }}
                            />
                          </div>
                          <div className="autor-info">
                            <h6 className="autor-nombre mb-1">{testimonio.nombre}</h6>
                            <small className="autor-detalles text-muted">
                              {testimonio.edad} años • {testimonio.tratamiento}
                            </small>
                            <br />
                            <small className="testimonio-fecha text-muted">
                              {testimonio.fecha}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controles de navegación */}
            <div className="testimonios-controls">
              <button 
                className="control-btn prev-btn" 
                onClick={prevTestimonio}
                aria-label="Testimonio anterior"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="control-btn next-btn" 
                onClick={nextTestimonio}
                aria-label="Siguiente testimonio"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Indicadores */}
            <div className="testimonios-indicators">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonio ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonio(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComentariosHome;
