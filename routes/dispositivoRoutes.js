const express = require("express");
const router = express.Router();
const dispositivoController = require("../controllers/dispositivoController");

// GET /api/dispositivos/:identificador
router.get("/:identificador", dispositivoController.getDispositivoByIdentificador);

module.exports = router;
