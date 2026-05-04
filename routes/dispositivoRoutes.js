const express = require("express");
const router = express.Router();
const dispositivoController = require("../controllers/dispositivoController");

// GET /api/dispositivos/:identificador
router.get("/:identificador", dispositivoController.getDispositivoByIdentificador);

// GET /api/dispositivos
router.get("/", dispositivoController.getAllDispositivos);


module.exports = router;
