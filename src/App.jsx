import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import PacientePage from "./Pages/PacientePage";
import KinesiologoPage from "./Pages/KinesiologoPage";
import MensajeriaInterna from "./Components/MensajeriaInterna/MensajeriaInterna.jsx";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage"
import FAQsPublicPage from "./Pages/FAQsPublicPage";
import LoginPage from "./Pages/LoginPage";
import AsistenciaEmpleado from "./Components/Asistencia/AsistenciaEmpleado.jsx";
import TurnosWebPage from "./Pages/TurnosWebPage.jsx";


function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/paciente" element={<PacientePage />} />
            <Route path="/kinesiologo" element={<KinesiologoPage />} />
            <Route path="/faqs" element={<FAQsPublicPage />} />
            <Route path="/mensajes" element={<MensajeriaInterna />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/asistencia" element={<AsistenciaEmpleado />} />
            <Route path="/turnos" element={<TurnosWebPage />} />
            <Route path="*" element={<div>404 - Página no encontrada</div>} />

          </Routes>
        </main>

        <Footer />
        
        {/* Chatbot flotante - visible en todas las páginas */}
      
      </div>
    </BrowserRouter>
  );
}

export default App;
