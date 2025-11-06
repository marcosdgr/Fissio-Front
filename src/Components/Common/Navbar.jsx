import React from "react";
import { Link } from "react-router-dom";
import "../../Css/Common/Navbar.css";


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light site-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo servido desde la carpeta public */}
          <img src="/logo-negro.png" alt="Fissio" className="fissio-logo me-2" />
          
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#fissioNavbar"
          aria-controls="fissioNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="fissioNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/servicios">Servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">Preguntas frecuentes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/turnos">Pedir turno</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;