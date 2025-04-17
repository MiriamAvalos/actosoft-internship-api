const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

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
router.post('/tareas', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body); // Para ver qué datos se están recibiendo

    const { descripcion, estado, fecha_limite, usuario_id } = req.body;

    // Validar los campos necesarios
    if (!descripcion || !estado || !fecha_limite || !usuario_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO tareas (descripcion, estado, fecha_limite, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [descripcion, estado, fecha_limite, usuario_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la tarea:', error.message);  // Mostrar mensaje de error
        res.status(500).json({ error: 'Error al crear la tarea', details: error.message }); // Detalles del error
    }
});


module.exports = router;
