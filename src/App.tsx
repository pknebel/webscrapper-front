import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { NavBar } from "./components/NavBar";
import { ConsultaAnual } from "./pages/ConsultaAnual";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consulta-anual" element={<ConsultaAnual />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;