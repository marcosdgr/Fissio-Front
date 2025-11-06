import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa';

const TurnoHome = () => {
  return (
    <div className="turno-cta-container">
      <div className="turno-content">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <h2 className="turno-title mb-3">
              ¿Listo para comenzar tu tratamiento?
            </h2>
            <p className="turno-description mb-4">
              Reserva tu cita en línea de manera rápida y sencilla. Nuestro equipo está listo para ayudarte a recuperar tu bienestar.
            </p>
            <div className="turno-buttons-container">
              <a href="/turnos" className="btn turno-btn-primary">
                <FaCalendarAlt className="me-2" />
                Agendar turno online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurnoHome