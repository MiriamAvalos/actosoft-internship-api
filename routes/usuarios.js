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
  

module.exports = router;  // Asegúrate de exportar las rutas
