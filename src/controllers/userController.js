const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Obtener todos los usuarios
const getUsers = async (_req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });

    const passwordHash = await bcrypt.hash(password, 10);
    const actualizado = await User.update(req.params.id, { email, passwordHash });
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const eliminado = await User.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
