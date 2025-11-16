import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CardComentariosHome = () => {
  const [currentTestimonio, setCurrentTestimonio] = useState(0);
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar comentarios publicados desde la BD
  useEffect(() => {
    const cargarComentarios = async () => {
      setLoading(true);
      try {
        // Usar el endpoint principal y filtrar los publicados
        const response = await fetch(`http://localhost:3000/api/comentarios/v1/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const todosLosComentarios = await response.json();
        console.log('Comentarios recibidos del backend:', todosLosComentarios);
        console.log('Primer comentario:', todosLosComentarios[0]);
        
        // Filtrar solo los comentarios publicados (IsPublicado = 1)
        const comentariosPublicados = todosLosComentarios.filter(c => c.IsPublicado === 1);
        console.log('Comentarios publicados filtrados:', comentariosPublicados);
        
        // Transformar los comentarios de la BD al formato esperado
        const testimoniosFormateados = comentariosPublicados.map(comentario => ({
          id: comentario.idComentario,
          nombre: `${comentario.NombrePaciente} ${comentario.ApellidoPaciente}`,
          edad: null, // No tenemos este dato
          tratamiento: comentario.NombreTratamiento || "Fisioterapia",
          rating: comentario.CalificacionComentario,
          comentario: comentario.Comentario,
          fecha: formatearFecha(comentario.FechaComentario),
          avatar: null // No tenemos avatares
        }));

        console.log('Testimonios formateados:', testimoniosFormateados);
        setTestimonios(testimoniosFormateados);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
        // Si hay error, no mostrar nada
        setTestimonios([]);
      } finally {
        setLoading(false);
      }
    };

    cargarComentarios();
  }, []);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return "Hoy";
    if (diffDias === 1) return "Ayer";
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
    if (diffDias < 365) return `Hace ${Math.floor(diffDias / 30)} meses`;
    return `Hace ${Math.floor(diffDias / 365)} años`;
  };

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

  // Estados de carga y sin datos
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando comentarios...</span>
        </div>
      </div>
    );
  }

  if (testimonios.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay comentarios publicados aún.</p>
      </div>
    );
  }

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
                        
                        <div className="testimonio-autor">
                          <div className="autor-info">
                            <h6 className="autor-nombre mb-1">{testimonio.nombre}</h6>
                            <small className="autor-detalles text-muted">
                              {testimonio.tratamiento}
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
