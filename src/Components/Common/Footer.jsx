import React from "react";
import { Link } from "react-router-dom";
import { FaInstagramSquare, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "../../Css/Common/Footer.css";

const Footer = () => {
  const mainMapLink = "https://www.google.com/maps?q=26.8167,-65.3167"; // Yerba Buena

  return (
    <footer className="site-footer text-white">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <h5 className="footer-brand">Centro de Kinesiología Fissio</h5>
            <p className="small">Atención profesional enfocada en rehabilitación y prevención. Tratamientos personalizados para recuperar tu movilidad.</p>
            <div className="social-icons mt-3">
              <a href="https://www.instagram.com/karenherrera.bd" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="me-2 social-link">
                <FaInstagramSquare />
              </a>
              <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="me-2 social-link">
                <FaFacebook />
              </a>
              <a href="https://api.whatsapp.com/send?phone=543813541077" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <h6>Contacto</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><FaPhoneAlt className="me-2"/> <a className="footer-link" href="tel:+543813541077">+54 9 381 354 1077</a></li>
              <li className="mb-2"><FaEnvelope className="me-2"/> <a className="footer-link" href="mailto:info@fissio.com">info@fissio.com</a></li>
              <li><FaMapMarkerAlt className="me-2"/> <a className="footer-link" href={mainMapLink} target="_blank" rel="noopener noreferrer">Ver ubicación</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <h6>Enlaces</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/faq" className="footer-link">Preguntas frecuentes</Link></li>
              <li className="mb-2"><Link to="/turnos" className="footer-link">Pedir turno</Link></li>
              <li><Link to="/nosotros" className="footer-link">Sobre nosotros</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-2 mb-4">
            <h6>Horario</h6>
            <p className="small mb-0">Lun - Vie: 08:00 - 20:00<br/>Sáb: 08:00 - 13:00</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center mt-4 border-top pt-3">
            <small>© {new Date().getFullYear()} Centro de Kinesiología Fissio. Todos los derechos reservados.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;