import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/usuarios", {
        nombre,
        email,
        password,
      });

      // Redirigir a login después del registro exitoso
      navigate('/login');
    } catch (error) {
      console.error('Error al registrarse:', error.response?.data || error.message);
      setErrorMensaje(error.response?.data?.error || 'Error al registrarse. Intenta de nuevo.');
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Registrar</button>
      </form>
      {errorMensaje && <p style={{ color: 'red' }}>{errorMensaje}</p>}
    </div>
  );
}

export default Registro;
