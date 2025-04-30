const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const verificarToken = require('./auth');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Ase
// gúrate de que JWT_SECRET esté configurado
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});


// POST /api/tareas → Crear una nueva tarea
// Middleware para verificar el token y extraer el user_id
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization

  if (!token) {
      return res.status(403).json({ error: 'No se proporcionó un token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Token no válido' });
      }
      
      // Si el token es válido, agregar el user_id al objeto req para acceder en las siguientes rutas
      req.user_id = decoded.user_id;
      next();
  });
};


router.get('/tareas', verifyToken, async (req, res) => {
  const user_id = req.user_id; // Asegúrate de que user_id está disponible

  if (!user_id) {
      return res.status(400).json({ error: 'No se pudo obtener el user_id del token' });
  }

  try {
      const result = await pool.query(
          'SELECT * FROM tareas WHERE usuario_id = $1',
          [user_id] // Aquí pasamos el user_id a la consulta
      );
      res.status(200).json(result.rows); // Devolver las tareas del usuario
  } catch (error) {
      console.error('Error al obtener las tareas:', error.message);
      res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});


// PUT /api/tareas/:id → Editar una tarea por su ID
router.put('/tareas/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const { descripcion, estado, fecha_limite } = req.body;
  const userId = req.user_id; // Corregido: accedemos al user_id directamente

  if (!descripcion || !estado || !fecha_limite) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
      // Verificamos si la tarea pertenece al usuario autenticado
      const result = await pool.query(
          'SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2',
          [id, userId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para editarla' });
      }

      // Si la tarea pertenece al usuario, la actualizamos
      const updateResult = await pool.query(
          'UPDATE tareas SET descripcion = $1, estado = $2, fecha_limite = $3 WHERE id = $4 RETURNING *',
          [descripcion, estado, fecha_limite, id]
      );

      res.json(updateResult.rows[0]);
  } catch (error) {
      console.error('Error al actualizar tarea:', error.message);
      res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});


// DELETE /api/tareas/:id → Eliminar una tarea por su ID
router.delete('/tareas/:id', verificarToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.user_id; // El usuario autenticado

  try {
      // Verificamos si la tarea pertenece al usuario autenticado
      const result = await pool.query(
          'SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2',
          [id, userId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para eliminarla' });
      }

      // Si la tarea pertenece al usuario, la eliminamos
      const deleteResult = await pool.query(
          'DELETE FROM tareas WHERE id = $1 RETURNING *',
          [id]
      );

      res.status(200).json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
      console.error('Error al eliminar tarea:', error.message);
      res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

  

module.exports = router;
