import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/useAuthStore";
import { showConfirm, showSuccess } from "../../Utils/sweetAlerts";
import "../../Css/Common/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();

  // Obtener rol y permiso del usuario
  const rol = user?.usuario?.NombreRol;
  const permiso = user?.usuario?.PermisosEmpleado;

  // Determinar qué botones mostrar según el rol
  const esAdmin = rol === "Administrador";
  const esPaciente = rol === "Paciente";
  const esEmpleado = rol === "Empleado";
  const esKinesiologo = esEmpleado && permiso === "Kinesiología";
  
  // Paciente: NO ver Mensajes
  // Admin/Empleado: NO ver Solicitud de turno ni Preguntas frecuentes
  const mostrarMensajes = esAdmin || esEmpleado;
  const mostrarPedirTurno = !esAdmin && !esEmpleado;
  const mostrarFAQs = !esAdmin && !esEmpleado;
  const mostrarObrasSociales = !esKinesiologo; 

  // Función para obtener la ruta del panel según el rol
  const obtenerRutaPanel = () => {
    if (esAdmin) return "/admin";
    if (esPaciente) return "/paciente";
    if (esEmpleado) {
      if (permiso === "Kinesiología") return "/kinesiologo";
      if (permiso === "Administración") return "/secretaria";
    }
    return "/";
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    const result = await showConfirm(
      "¿Cerrar sesión?",
      "¿Estás seguro que deseas salir de tu cuenta?",
      "Sí, cerrar sesión",
      "Cancelar"
    );

    if (result.isConfirmed) {
      logout();
      showSuccess("¡Hasta pronto!", "Has cerrado sesión correctamente");
      navigate("/");
    }
  };

  // Función para cerrar el navbar en mobile
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('fissioNavbar');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = window.bootstrap?.Collapse?.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        // Si no hay instancia, crear una y cerrar
        const collapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
        collapse.hide();
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light site-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo-blanco.png"
            alt="Fissio"
            className="fissio-logo me-2"
          />
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
              <Link className="nav-link" to="/" onClick={closeNavbar}>
                Inicio
              </Link>
            </li>
          
            {mostrarFAQs && (
              <li className="nav-item">
                <Link className="nav-link" to="/faqs" onClick={closeNavbar}>
                  Preguntas frecuentes
                </Link>
              </li>
            )}
          
            {mostrarPedirTurno && (
              <li className="nav-item">
                <Link className="nav-link" to="/turnos" onClick={closeNavbar}>
                  Pedir turno
                </Link>
              </li>
            )}
            
            {mostrarObrasSociales && (
              <li className="nav-item">
                <Link className="nav-link" to="/obras-sociales" onClick={closeNavbar}>
                  Obras Sociales
                </Link>
              </li>
            )}
            
            {mostrarMensajes && (
              <li className="nav-item">
                <Link className="nav-link" to="/mensajes" onClick={closeNavbar}>
                  Mensajes
                </Link>
              </li>
            )}
            
            {isLoggedIn && (
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to={obtenerRutaPanel()}
                  title="Ir a mi panel"
                  onClick={closeNavbar}
                >
                  <span className="material-symbols-outlined">person</span>
                </Link>
              </li>
            )}
            
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-decoration-none"
                  onClick={() => { handleLogout(); closeNavbar(); }}
                  style={{ border: "none", background: "transparent" }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/Login" onClick={closeNavbar}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
