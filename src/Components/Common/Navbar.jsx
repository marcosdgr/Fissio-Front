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
  
  // Paciente: NO ver Mensajes
  // Admin/Empleado: NO ver Solicitud de turno ni Preguntas frecuentes
  const mostrarMensajes = esAdmin || esEmpleado;
  const mostrarPedirTurno = !esAdmin && !esEmpleado;
  const mostrarFAQs = !esAdmin && !esEmpleado;

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

  return (
    <nav className="navbar navbar-expand-lg navbar-light site-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo servido desde la carpeta public */}
          <img
            src="/logo-negro.png"
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
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            
            {/* Solo mostrar para usuarios no logueados, pacientes o visitantes */}
            {mostrarFAQs && (
              <li className="nav-item">
                <Link className="nav-link" to="/faqs">
                  Preguntas frecuentes
                </Link>
              </li>
            )}
            
            {/* Solo mostrar para usuarios no logueados, pacientes o visitantes */}
            {mostrarPedirTurno && (
              <li className="nav-item">
                <Link className="nav-link" to="/turnos">
                  Pedir turno
                </Link>
              </li>
            )}
            
            {/* Solo mostrar para Admin y Empleados */}
            {mostrarMensajes && (
              <li className="nav-item">
                <Link className="nav-link" to="/mensajes">
                  Mensajes
                </Link>
              </li>
            )}
            
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-decoration-none"
                  onClick={handleLogout}
                  style={{ border: "none", background: "transparent" }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/Login">
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
