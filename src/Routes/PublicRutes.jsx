import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
    return children;
  }

  const rol = user.usuario?.NombreRol;
  const permiso = user.usuario?.PermisosEmpleado;

  // Redirigir según rol/permiso si ya está logueado
  if (rol === "Administrador") {
    return <Navigate to="/admin" replace />;
  }

  if (rol === "Paciente") {
    return <Navigate to="/paciente" replace />;
  }

  if (rol === "Empleado") {
    if (permiso === "Kinesiologia") {
      return <Navigate to="/kinesiologo" replace />;
    }
    if (permiso === "Administracion") {
      return <Navigate to="/secretaria" replace />;
    }
    return <Navigate to="/empleado" replace />; // por si en algún momento agregás esta vista
  }

  return <Navigate to="/" replace />;
};

export default PublicRoute;
