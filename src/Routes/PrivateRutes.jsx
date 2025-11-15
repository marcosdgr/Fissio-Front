import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";

const ProtectedRoute = ({ children, roles, permisos }) => {
  const { isLoggedIn, user } = useAuthStore();

  // 1) Si no está logueado → a login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  const rolUsuario = user.usuario?.NombreRol;              // Administrador / Paciente / Empleado
  const permisoEmpleado = user.usuario?.PermisosEmpleado;  // Kinesiologia / Administracion / null

  // 2) Si se especifican roles permitidos, validar
  if (roles && roles.length > 0 && !roles.includes(rolUsuario)) {
    return <Navigate to="/" replace />;
  }

  // 3) Si se especifican permisos (solo aplica para Empleado)
  if (
    permisos &&
    permisos.length > 0 &&
    rolUsuario === "Empleado" &&
    !permisos.includes(permisoEmpleado)
  ) {
    return <Navigate to="/" replace />;
  }

  // 4) Si pasa todas las validaciones → mostrar la ruta
  return children;
};

export default ProtectedRoute;
