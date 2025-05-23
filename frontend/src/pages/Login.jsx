import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // para redirigir


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook de navegación
  const [errorMensaje, setErrorMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // ✅ Primero guardamos los datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.nombre);

      console.log('Token guardado en localStorage.');
      console.log('Usuario autenticado:', token);
      

      // ✅ Luego redirigimos al dashboard (o a la ruta que necesites)
      navigate('/tareas');

    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      setErrorMensaje(error.response?.data?.error || 'Error al iniciar sesión. Inténtalo de nuevo.');
      
  }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Ingresar</button>
      </form>
      <p>
      ¿No tienes una cuenta? <a href="/usuarios">Regístrate</a>
     </p>
      {errorMensaje && <p style={{ color: 'red' }}>{errorMensaje}</p>}
   
    </div>
    
  );
}

export default Login;
