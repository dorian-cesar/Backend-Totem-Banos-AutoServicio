const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");
const authenticate = require("../middlewares/auth");

// Todas las rutas protegidas
router.use(authenticate);

// CRUD Ventas
router.post("/", ventaController.createVenta);
router.get("/", ventaController.getVentas);
router.get("/:id", ventaController.getVentaById);


module.exports = router;