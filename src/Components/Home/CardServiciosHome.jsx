import React, { useState, useEffect, useRef } from "react";
import { FaUserMd, FaDumbbell, FaHeartbeat, FaBaby, FaRunning, FaHands, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CardServiciosHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  
  const servicios = [
    {
      id: 1,
      icon: <FaUserMd />,
      titulo: "Kinesiología General",
      descripcion: "Tratamiento integral para lesiones musculoesqueléticas y recuperación funcional.",
      caracteristicas: ["Evaluación completa", "Plan personalizado", "Seguimiento continuo"]
    },
    {
      id: 2,
      icon: <FaDumbbell />,
      titulo: "Rehabilitación Deportiva",
      descripcion: "Especialización en lesiones deportivas y retorno seguro a la actividad física.",
      caracteristicas: ["Atletas de elite", "Técnicas avanzadas", "Prevención de lesiones"]
    },
    {
      id: 3,
      icon: <FaHeartbeat />,
      titulo: "Kinesiología Respiratoria",
      descripcion: "Tratamiento especializado para afecciones del sistema respiratorio.",
      caracteristicas: ["Técnicas específicas", "Ejercicios respiratorios", "Mejora de capacidad"]
    },
    {
      id: 4,
      icon: <FaBaby />,
      titulo: "Kinesiología Pediátrica",
      descripcion: "Atención especializada para niños con enfoque lúdico y familiar.",
      caracteristicas: ["Desarrollo motor", "Terapia lúdica", "Seguimiento familiar"]
    },
    {
      id: 5,
      icon: <FaRunning />,
      titulo: "Reeducación Postural",
      descripcion: "Corrección de posturas y prevención de dolores crónicos.",
      caracteristicas: ["Análisis postural", "Ejercicios correctivos", "Educación preventiva"]
    },
    {
      id: 6,
      icon: <FaHands />,
      titulo: "Terapia Manual",
      descripcion: "Técnicas manuales especializadas para tratamiento del dolor.",
      caracteristicas: ["Técnicas osteopáticas", "Movilización articular", "Liberación miofascial"]
    }
  ];

  // Duplicar servicios para efecto infinito
  const serviciosInfinitos = [...servicios, ...servicios, ...servicios];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      
      // Reiniciar posición sin transición cuando llegamos al límite
      if (currentIndex >= servicios.length) {
        trackRef.current.style.transition = 'none';
        setCurrentIndex(0);
        setTimeout(() => {
          trackRef.current.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      } else if (currentIndex < 0) {
        trackRef.current.style.transition = 'none';
        setCurrentIndex(servicios.length - 1);
        setTimeout(() => {
          trackRef.current.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, servicios.length]);

  return (
    <div className="servicios-carousel-container">
      <button className="carousel-control-prev-servicios" onClick={prevSlide}>
        <FaChevronLeft />
      </button>
      
      <div className="servicios-carousel-wrapper">
        <div 
          ref={trackRef}
          className="servicios-carousel-track"
          style={{ transform: `translateX(-${(currentIndex + servicios.length) * 33.333}%)` }}
        >
          {serviciosInfinitos.map((servicio, index) => (
            <div key={`${servicio.id}-${index}`} className="servicio-card-slide">
              <div className="card servicio-card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="servicio-icon-container text-center mb-3">
                    <div className="servicio-icon">
                      {servicio.icon}
                    </div>
                  </div>
                  
                  <h5 className="card-title servicio-titulo text-center mb-3">
                    {servicio.titulo}
                  </h5>
                  
                  <p className="card-text servicio-descripcion text-center mb-3 flex-grow-1">
                    {servicio.descripcion}
                  </p>
                  
                  <ul className="servicio-caracteristicas list-unstyled mb-4">
                    {servicio.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="d-flex align-items-center mb-2">
                        <span className="caracteristica-check me-2">✓</span>
                        <small>{caracteristica}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-control-next-servicios" onClick={nextSlide}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default CardServiciosHome;
