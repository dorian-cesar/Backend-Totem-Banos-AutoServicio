const express = require('express');
const {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
} = require('../controllers/servicioController');

const router = express.Router();

// CRUD servicios
router.get('/', getServicios);         // Obtener todos
router.get('/:id', getServicioById);   // Obtener uno por ID
router.post('/', createServicio);      // Crear
router.put('/:id', updateServicio);    // Actualizar
router.delete('/:id', deleteServicio); // Eliminar

module.exports = router;
