import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import AdminPage from './Pages/AdminPage';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;