
// Cargar las variables de entorno del archivo .env
require('dotenv').config();

const { Pool } = require('pg'); // Usamos Pool para manejar conexiones de forma eficiente

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

// Verificar si la conexión fue exitosa
pool.connect()
  .then(() => console.log('conexión exitosa a base de datos AWS'))
  .catch(err => console.error('Error al conectar a la base de datos', err));

module.exports = pool;
