import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token'); // 👈 obtenemos el token

        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/tareas', {
          headers: {
            Authorization: `Bearer ${token}` // 👈 enviamos el token en headers
          }
        });

        setTareas(response.data); // 👈 actualizamos las tareas
        setLoading(false);
        console.log("lista de tareas:", response.data);
      } catch (error) {
        console.error('Error al obtener tareas:', error.message);
        setLoading(false);
      }
    };

    fetchTareas();
  }, []);

  if (loading) return <p>Cargando tareas...</p>;

  return (
    <div>
      <h1>Tareas</h1>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            {tarea.descripcion} - Estado: {tarea.estado} - Fecha límite: {tarea.fecha_limite}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tareas;
