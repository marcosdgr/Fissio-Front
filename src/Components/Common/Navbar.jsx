import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/useAuthStore";
import { showConfirm, showSuccess } from "../../Utils/sweetAlerts";
import "../../Css/Common/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  // Función para cerrar sesión
  const handleLogout = async () => {
    const result = await showConfirm(
      '¿Cerrar sesión?',
      '¿Estás seguro que deseas salir de tu cuenta?',
      'Sí, cerrar sesión',
      'Cancelar'
    );

    if (result.isConfirmed) {
      logout();
      showSuccess('¡Hasta pronto!', 'Has cerrado sesión correctamente');
      navigate('/');
    }
  };

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
              <Link className="nav-link" to="/faqs">Preguntas frecuentes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/turnos">Pedir turno</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mensajes">
                Mensajes
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link text-decoration-none"
                  onClick={handleLogout}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/Login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;