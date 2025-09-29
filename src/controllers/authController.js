const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const exists = await User.findByEmail(email);
    if (exists) return res.status(400).json({ error: 'Usuario ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await User.create({ email, passwordHash });

    res.status(201).json({ message: 'Usuario creado', user: nuevo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login y obtención de token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    res.json({ token, expiresIn: EXPIRES_IN });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware para proteger rutas
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const me = async (req, res) => {
  try {
    // req.user se setea en requireAuth
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, requireAuth, me };