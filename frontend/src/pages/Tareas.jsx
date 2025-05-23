import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tareas = () => {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    descripcion: '',
    estado: '',
    fecha_limite: ''
  });
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const token = localStorage.getItem('token');

  const obtenerTareas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tareas', {
        headers: { Authorization: `Bearer ${token}` }
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
      await axios.post('http://localhost:5000/api/tareas', nuevaTarea, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNuevaTarea({ descripcion: '', estado: '', fecha_limite: '' });
      obtenerTareas();
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const seleccionarTarea = (tarea) => {
    setTareaSeleccionada(tarea);
    setNuevaTarea({
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha_limite: tarea.fecha_limite
    });
  };

  const editarTarea = async (e) => {
    e.preventDefault();
    if (!tareaSeleccionada) return;
    try {
      await axios.put(
        `http://localhost:5000/api/tareas/${tareaSeleccionada.id}`,
        nuevaTarea,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNuevaTarea({ descripcion: '', estado: '', fecha_limite: '' });
      setTareaSeleccionada(null);
      obtenerTareas();
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      console.log('Eliminando tarea con id:', id);
      await axios.delete(`http://localhost:5000/api/tareas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      obtenerTareas();
    } catch (error) {
      
      console.error('Error al eliminar tarea:', error);
    }
  };

  const cancelarEdicion = () => {
    setTareaSeleccionada(null);
    setNuevaTarea({ descripcion: '', estado: '', fecha_limite: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <h1>Tareas</h1>

      <form onSubmit={tareaSeleccionada ? editarTarea : crearTarea}>
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
        <button type="submit">
          {tareaSeleccionada ? 'Guardar Cambios' : 'Crear Tarea'}
        </button>
        {tareaSeleccionada && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            {tarea.descripcion} - {tarea.estado} - {tarea.fecha_limite}
            <button onClick={() => seleccionarTarea(tarea)}>Editar</button>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tareas;
