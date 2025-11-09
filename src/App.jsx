import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import MensajeriaInterna from "./Components/MensajeriaInterna/MensajeriaInterna.jsx";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage"
import FAQsPublicPage from "./Pages/FAQsPublicPage";
import LoginPage from "./Pages/LoginPage";
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
            <Route path="/faqs" element={<FAQsPublicPage />} />
            <Route path="/mensajes" element={<MensajeriaInterna />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
