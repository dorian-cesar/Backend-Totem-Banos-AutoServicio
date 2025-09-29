const pool = require('../config/db');

const User = {
  async getAll() {
    const [rows] = await pool.query('SELECT id, email, created_at FROM users ORDER BY id DESC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create({ email, passwordHash }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return { id: result.insertId, email };
  },

  async update(id, { email, passwordHash }) {
    const [result] = await pool.query(
      'UPDATE users SET email = ?, password_hash = ? WHERE id = ?',
      [email, passwordHash, id]
    );
    return result.affectedRows > 0 ? { id, email } : null;
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = User;
