// controllers/roleController.js
const Role = require("../models/Role");

// Crear nuevo rol
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un rol por id
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) return res.status(404).json({ error: "Rol no encontrado" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar rol
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ error: "Rol no encontrado" });

    role.name = name || role.name;
    await role.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar rol
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) return res.status(404).json({ error: "Rol no encontrado" });

    await role.destroy();
    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};