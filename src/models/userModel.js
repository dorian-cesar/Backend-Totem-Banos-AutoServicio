const pool = require('../config/db');

const User = {
  async getAll() {
    const [rows] = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY id DESC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT id, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create({ email, passwordHash, role = 'user' }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role]
    );
    return { id: result.insertId, email, role };
  },

  async update(id, { email, passwordHash, role }) {
    const [result] = await pool.query(
      'UPDATE users SET email = ?, password_hash = ?, role = ? WHERE id = ?',
      [email, passwordHash, role, id]
    );
    return result.affectedRows > 0 ? { id, email, role } : null;
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = User;
