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

  
// Ruta GET para obtener tareas
router.get('/tareas', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM tareas ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error al obtener tareas:', error.message);
      res.status(500).json({ error: 'Error al obtener tareas' });
    }
  });



  // PUT /api/tareas/:id → Editar una tarea por su ID
router.put('/tareas/:id', async (req, res) => {
    const id = req.params.id;
    const { descripcion, estado, fecha_limite } = req.body;
  
    if (!descripcion || !estado || !fecha_limite) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    try {
      const result = await pool.query(
        'UPDATE tareas SET descripcion = $1, estado = $2, fecha_limite = $3 WHERE id = $4 RETURNING *',
        [descripcion, estado, fecha_limite, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar tarea:', error.message);
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  });
  
  

module.exports = router;
