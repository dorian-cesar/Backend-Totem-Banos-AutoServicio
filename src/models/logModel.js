const pool = require('../config/db');

// Obtener logs con filtros
async function getLogs({ userId, email, endpoint, startDate, endDate, limit = 100 }) {
  let query = `SELECT * FROM api_logs WHERE 1=1`;
  const params = [];

  if (userId) {
    query += ` AND user_id = ?`;
    params.push(userId);
  }

  if (email) {
    query += ` AND user_email LIKE ?`;
    params.push(`%${email}%`);
  }

  if (endpoint) {
    query += ` AND endpoint LIKE ?`;
    params.push(`%${endpoint}%`);
  }

  if (startDate) {
    query += ` AND created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND created_at <= ?`;
    params.push(endDate);
  }

  query += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows;
}

// Obtener logs paginados
async function getLogsPaginated(limit = 100, offset = 0) {
  const [rows] = await pool.query(
    `SELECT * FROM api_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
}

// Contar total de registros
async function countLogs() {
  const [rows] = await pool.query(`SELECT COUNT(*) as total FROM api_logs`);
  return rows[0].total;
}

module.exports = { getLogs, getLogsPaginated, countLogs };
