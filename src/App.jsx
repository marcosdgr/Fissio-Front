import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import PacientePage from "./Pages/PacientePage";
import KinesiologoPage from "./Pages/KinesiologoPage";
import SecretariaPage from "./Pages/SecretariaPage";
import MensajeriaInterna from "./Components/MensajeriaInterna/MensajeriaInterna.jsx";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import FAQsPublicPage from "./Pages/FAQsPublicPage";
import LoginPage from "./Pages/LoginPage";
import AsistenciaEmpleado from "./Components/Asistencia/AsistenciaEmpleado.jsx";
import TurnosWebPage from "./Pages/TurnosWebPage.jsx";


import PublicRutes from "./Routes/PublicRutes.jsx";
import PrivateRutes from "./Routes/PrivateRutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-fill app-main">
          <Routes>
            {/* 🔓 RUTAS PÚBLICAS */}
            <Route path="/" element={<HomePage />} />
            <Route path="/faqs" element={<FAQsPublicPage />} />
            <Route path="/turnos" element={<TurnosWebPage />} />

            {/* Login y Register → públicas, pero redirigen si ya está logueado */}
            <Route
              path="/login"
              element={
                <PublicRutes>
                  <LoginPage />
                </PublicRutes>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRutes>
                  <RegisterPage />
                </PublicRutes>
              }
            />

            {/* 🔒 RUTAS PRIVADAS POR ROL / PERMISO */}

            {/* Solo Administrador */}
            <Route
              path="/admin"
              element={
                <PrivateRutes roles={["Administrador"]}>
                  <AdminPage />
                </PrivateRutes>
              }
            />

            {/* Solo Paciente */}
            <Route
              path="/paciente"
              element={
                <PrivateRutes roles={["Paciente"]}>
                  <PacientePage />
                </PrivateRutes>
              }
            />

            {/* Empleado Kinesiólogo */}
            <Route
              path="/kinesiologo"
              element={
                <PrivateRutes roles={["Empleado"]} permisos={["Kinesiología"]}>
                  <KinesiologoPage />
                </PrivateRutes>
              }
            />

            {/* Empleado Administración → Secretaria */}
            <Route
              path="/secretaria"
              element={
                <PrivateRutes
                  roles={["Empleado"]}
                  permisos={["Administración"]}
                >
                  <SecretariaPage />
                </PrivateRutes>
              }
            />

            {/* Mensajería interna: Admin + cualquier Empleado */}
            <Route
              path="/mensajes"
              element={
                <PrivateRutes roles={["Administrador", "Empleado"]}>
                  <MensajeriaInterna />
                </PrivateRutes>
              }
            />

            {/* Asistencia: cualquier Empleado (kine o admin) */}
            <Route
              path="/asistencia"
              element={
                <PrivateRutes roles={["Empleado"]}>
                  <AsistenciaEmpleado />
                </PrivateRutes>
              }
            />

            {/* 404 */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
