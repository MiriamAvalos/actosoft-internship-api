import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    descripcion: '',
    estado: '',
    fecha_limite: ''
  });

  const token = localStorage.getItem('token');

  const obtenerTareas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tareas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTareas(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  const manejarCambio = (e) => {
    setNuevaTarea({
      ...nuevaTarea,
      [e.target.name]: e.target.value
    });
  };

  const crearTarea = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/tareas',
        nuevaTarea,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNuevaTarea({ descripcion: '', estado: '', fecha_limite: '' });
      obtenerTareas(); // Actualiza la lista
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  return (
    <div>
      <h1>Tareas</h1>

      <form onSubmit={crearTarea}>
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={manejarCambio}
          required
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={nuevaTarea.estado}
          onChange={manejarCambio}
          required
        />
        <input
          type="date"
          name="fecha_limite"
          value={nuevaTarea.fecha_limite}
          onChange={manejarCambio}
          required
        />
        <button type="submit">Crear Tarea</button>
      </form>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>{tarea.descripcion} - {tarea.estado} - {tarea.fecha_limite}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tareas;
