const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });
    res.json(users); // defaultScope ya oculta password_hash
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user); // sanitizado por defaultScope/toJSON
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, last_name, email, password, role_id, is_active = true } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: "El email ya existe" });

    const password_hash = await bcrypt.hash(password, 10);
    const created = await User.create({ name, last_name, email, password_hash, role_id, is_active });

    // Opcional: cargar rol en respuesta
    const user = await User.findByPk(created.id, {
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });

    res.status(201).json(user); // ya viene sin hash
  } catch (err) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, last_name, email, password, role_id, is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const fields = { name, last_name, email, role_id, is_active };
    if (password) fields.password_hash = await bcrypt.hash(password, 10);

    await user.update(fields);

    const updated = await User.findByPk(user.id, {
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });

    res.json(updated); // sin hash
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};