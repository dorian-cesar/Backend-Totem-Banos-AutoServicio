const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const servicioRoutes = require('./routes/servicioRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { requireAuth } = require('./controllers/authController');


const app = express();

// CORS dinámico
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Ruta pública
app.get('/', (req, res) => res.json({ message: `Servidor funcionando en ${process.env.NODE_ENV} 🚀` }));

// Rutas públicas de auth
app.use('/api/auth', authRoutes);

// Middleware global: a partir de aquí exige JWT
app.use(requireAuth);

// Rutas protegidas de usuarios
app.use('/api/users', userRoutes);

// Rutas protegidas
app.use('/api/servicios', servicioRoutes);

// ⚠️ Middleware de manejo de errores global
app.use((err, req, res, _next) => {
  console.error('🔥 Error capturado:', err); // visible en consola
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;