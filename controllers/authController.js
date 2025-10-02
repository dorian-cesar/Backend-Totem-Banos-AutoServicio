// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email y password requeridos" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    if (!user.is_active) return res.status(403).json({ error: "Usuario inactivo" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
