const express = require("express");
const router = express.Router();
const dispositivoController = require("../controllers/dispositivoController");

// GET /api/dispositivos/:identificador
router.get("/:identificador", dispositivoController.getDispositivoByIdentificador);

// GET /api/dispositivos
router.get("/", dispositivoController.getAllDispositivos);

// PATCH /api/dispositivos/:identificador/status
router.patch("/:identificador/status", dispositivoController.updateDispositivoStatus);

// PUT /api/dispositivos/:identificador/status
router.put("/:identificador/status", dispositivoController.updateDispositivoStatus);

module.exports = router;
