// server.js o db.js
require('dotenv').config();  // Esto carga las variables del archivo .env

const express = require('express');
const app = express();
const usuariosRoutes = require('./routes/usuarios');  // Importa las rutas de usuarios

// Conexión a la base de datos, aquí se usan las variables de entorno
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

// Verifica la conexión
pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos AWS'))
  .catch(err => console.error('Error al conectar a la base de datos', err));

// Middleware para manejar las rutas de usuarios
app.use('/api', usuariosRoutes);  // Aquí estás agregando el prefijo /api a las rutas de usuarios

app.listen(5000, () => {
  console.log('Servidor corriendo en puerto 5000');
});
