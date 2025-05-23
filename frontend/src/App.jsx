import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tareas from "./pages/Tareas";
import Registro from "./pages/Registro";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/usuarios" element={<Registro />} />
      <Route path="/tareas" element={<Tareas />} />
    
   
    </Routes>
  );
}

export default App;