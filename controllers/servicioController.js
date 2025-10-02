// controllers/servicioController.js
const Servicio = require("../models/Servicio");

exports.getAll = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });
    res.json(servicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener servicio" });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) return res.status(400).json({ error: "Nombre y precio requeridos" });

    const servicio = await Servicio.create({ nombre, precio });
    res.status(201).json(servicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear servicio" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;

    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });

    servicio.nombre = nombre ?? servicio.nombre;
    servicio.precio = precio ?? servicio.precio;
    await servicio.save();

    res.json(servicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });

    await servicio.destroy();
    res.json({ message: "Servicio eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
};
