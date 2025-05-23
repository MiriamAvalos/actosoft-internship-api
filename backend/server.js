const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// ✅ Middleware primero
//permite todos -> app.use(cors());
//permitir solicitudes solo de mi puerto
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

// ✅ Luego las rutas
const usuariosRoutes = require('./routes/usuarios');
const tareasRoutes = require('./routes/tareas');
const authRoutes = require('./routes/auth');

app.use('/api', usuariosRoutes);
app.use('/api', tareasRoutes);
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
