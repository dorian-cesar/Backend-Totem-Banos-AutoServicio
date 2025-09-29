const pool = require('../config/db');

async function auditLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;

    const logData = {
      user_id: req.user ? req.user.id : null,
      user_email: req.user ? req.user.email : 'public/anon',
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      status_code: res.statusCode,
      response_time_ms: duration,
    };

    try {
      await pool.query(
        `INSERT INTO api_logs (user_id, user_email, method, endpoint, ip, status_code, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          logData.user_id,
          logData.user_email,
          logData.method,
          logData.endpoint,
          logData.ip,
          logData.status_code,
          logData.response_time_ms,
        ]
      );
    } catch (err) {
      console.error("❌ Error guardando log:", err.message);
    }
  });

  next();
}

module.exports = auditLogger;