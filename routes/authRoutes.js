// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/auth");

// Login
router.post("/login", authController.login);

// Ruta protegida
router.get("/me", authenticate, authController.me);

// Registro de usuario
router.post("/registro", authController.registro);

module.exports = router;