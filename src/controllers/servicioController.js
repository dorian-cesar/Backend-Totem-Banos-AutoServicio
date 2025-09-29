const Servicio = require('../models/servicioModel');

// Obtener todos los servicios
const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.getAll();
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener servicio por ID
const getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.getById(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un servicio
const createServicio = async (req, res) => {
  try {
    const nuevo = await Servicio.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un servicio
const updateServicio = async (req, res) => {
  try {
    const actualizado = await Servicio.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un servicio
const deleteServicio = async (req, res) => {
  try {
    const eliminado = await Servicio.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json({ message: 'Servicio eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
};
