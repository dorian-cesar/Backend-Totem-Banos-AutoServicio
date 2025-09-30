const { getLogs, getLogsPaginated, countLogs } = require('../models/logModel');

// Logs filtrados
async function listLogs(req, res) {
  try {
    if (!req.user || req.user.email !== 'admin@wit.la') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { userId, email, endpoint, startDate, endDate, limit } = req.query;

    const logs = await getLogs({
      userId,
      email,
      endpoint,
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : 100,
    });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo logs' });
  }
}

// Logs paginados (escala a millones de registros)
async function listPaginatedLogs(req, res) {
  try {
    if (!req.user || req.user.email !== 'admin@wit.la') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const offset = parseInt(req.query.offset) || 0;

    const [logs, total] = await Promise.all([
      getLogsPaginated(limit, offset),
      countLogs(),
    ]);

    res.json({
      total,
      limit,
      offset,
      hasNext: offset + limit < total,
      logs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo logs paginados' });
  }
}

module.exports = { listLogs, listPaginatedLogs };