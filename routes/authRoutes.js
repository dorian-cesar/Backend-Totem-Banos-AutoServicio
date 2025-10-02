// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/auth");

// Login
router.post("/login", authController.login);

// Ruta protegida
router.get("/me", authenticate, authController.me);

module.exports = router;
