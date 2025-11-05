import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Components/Common/Footer";
import Navbar from "./Components/Common/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill app-main">
          <h1 className="text-center mt-4">Holis</h1>
          <Routes>
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
