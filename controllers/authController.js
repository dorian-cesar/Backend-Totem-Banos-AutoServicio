// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email y password requeridos" });

    //Importante: incluye el hash SOLO aquí
    const user = await User.scope("withPassword").findOne({
      where: { email },
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });

    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    if (!user.is_active) return res.status(403).json({ error: "Usuario inactivo" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const payload = { id: user.id, email: user.email, role_id: user.role_id, role: user.role?.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "60m",
    });

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.registro = async (req, res) => {
  try {
    const { name, last_name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y password son requeridos" });
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(409).json({ error: "El email ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);

    // buscar rol en la tabla roles
    const roleObj = await Role.findOne({ where: { name: role } });
    if (!roleObj) return res.status(400).json({ error: "Rol inválido" });

    const user = await User.create({
      name,
      last_name,
      email,
      password_hash,
      role_id: roleObj.id,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: roleObj.name,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};