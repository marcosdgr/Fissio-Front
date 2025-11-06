import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import AdminPage from './Pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;