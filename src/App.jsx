import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Components/Common/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-fill">
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
