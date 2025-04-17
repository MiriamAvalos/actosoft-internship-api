// routes/usuarios.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');  // Conexión a la base de datos

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

// GET para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);  // Devuelve los resultados como un JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
});


// POST /api/usuarios → Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
    console.log('req.body:', req.body); // Esto debería mostrar el cuerpo de la solicitud en la consola
    const { nombre, email } = req.body;
  
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
        [nombre, email]
      );
      console.log('Usuario creado:', result.rows[0]);  // Esto muestra el usuario recién creado
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  });
  



  // DELETE /api/usuarios/:id → Eliminar un usuario por ID
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtén el ID del usuario desde los parámetros de la URL
  
    try {
      const result = await pool.query(
        'DELETE FROM usuarios WHERE id = $1 RETURNING *', 
        [id]
      );
  
      if (result.rowCount === 0) {
        // Si no se encuentra el usuario con el ID proporcionado
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  });
  

module.exports = router;  // Asegúrate de exportar las rutas
