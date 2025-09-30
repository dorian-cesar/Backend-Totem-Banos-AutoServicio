const pool = require('../config/db');
const { nowChileSQL } = require('../utils/time');

const Servicio = {
  async getAll() {
    const [rows] = await pool.query('SELECT id, nombre, precio, created_at FROM servicios ORDER BY id DESC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT id, nombre, precio, created_at FROM servicios WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre, precio } = data;
    if (!nombre || precio == null) {
      throw new Error('Campos requeridos: nombre, precio');
    }
    const [result] = await pool.query(
      'INSERT INTO servicios (nombre, precio, created_at) VALUES (?, ?, ?)',
      [nombre, precio, nowChileSQL()]
    );
    return { id: result.insertId, nombre, precio };
  },

  async update(id, data) {
    const { nombre, precio } = data;
    const [result] = await pool.query(
      'UPDATE servicios SET nombre = ?, precio = ? WHERE id = ?',
      [nombre, precio, id]
    );
    return result.affectedRows > 0 ? { id, nombre, precio } : null;
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM servicios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Servicio;