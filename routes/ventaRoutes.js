const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");

// CRUD Ventas
router.post("/", ventaController.createVenta);
router.get("/", ventaController.getVentas);
router.get("/:id", ventaController.getVentaById);


module.exports = router;