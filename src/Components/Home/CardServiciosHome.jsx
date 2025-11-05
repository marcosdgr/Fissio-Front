import React from "react";
import { FaUserMd, FaDumbbell, FaHeartbeat, FaBaby, FaRunning, FaHands } from "react-icons/fa";

const CardServiciosHome = () => {
  const servicios = [
    {
      id: 1,
      icon: <FaUserMd />,
      titulo: "Kinesiología General",
      descripcion: "Tratamiento integral para lesiones musculoesqueléticas y recuperación funcional.",
      precio: "Desde $8.000",
      caracteristicas: ["Evaluación completa", "Plan personalizado", "Seguimiento continuo"]
    },
    {
      id: 2,
      icon: <FaDumbbell />,
      titulo: "Rehabilitación Deportiva",
      descripcion: "Especialización en lesiones deportivas y retorno seguro a la actividad física.",
      precio: "Desde $10.000",
      caracteristicas: ["Atletas de elite", "Técnicas avanzadas", "Prevención de lesiones"]
    },
    {
      id: 3,
      icon: <FaHeartbeat />,
      titulo: "Kinesiología Respiratoria",
      descripcion: "Tratamiento especializado para afecciones del sistema respiratorio.",
      precio: "Desde $9.000",
      caracteristicas: ["Técnicas específicas", "Ejercicios respiratorios", "Mejora de capacidad"]
    },
    {
      id: 4,
      icon: <FaBaby />,
      titulo: "Kinesiología Pediátrica",
      descripcion: "Atención especializada para niños con enfoque lúdico y familiar.",
      precio: "Desde $8.500",
      caracteristicas: ["Desarrollo motor", "Terapia lúdica", "Seguimiento familiar"]
    },
    {
      id: 5,
      icon: <FaRunning />,
      titulo: "Reeducación Postural",
      descripcion: "Corrección de posturas y prevención de dolores crónicos.",
      precio: "Desde $7.500",
      caracteristicas: ["Análisis postural", "Ejercicios correctivos", "Educación preventiva"]
    },
    {
      id: 6,
      icon: <FaHands />,
      titulo: "Terapia Manual",
      descripcion: "Técnicas manuales especializadas para tratamiento del dolor.",
      precio: "Desde $9.500",
      caracteristicas: ["Técnicas osteopáticas", "Movilización articular", "Liberación miofascial"]
    }
  ];

  return (
    <div className="row g-4">
      {servicios.map((servicio) => (
        <div key={servicio.id} className="col-12 col-md-6 col-lg-4">
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
              
              <div className="servicio-precio text-center mb-3">
                <span className="precio-text fw-bold">{servicio.precio}</span>
              </div>
              
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
  );
};

export default CardServiciosHome;
