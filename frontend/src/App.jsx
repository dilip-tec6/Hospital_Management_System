import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Patients from "./pages/Patients/Patients";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;