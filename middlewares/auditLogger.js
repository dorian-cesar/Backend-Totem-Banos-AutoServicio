const ApiLog = require("../models/ApiLog");
const { nowChile } = require("../utils/time");

async function auditLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      await ApiLog.create({
        user_id: req.user ? req.user.id : null,
        user_email: req.user ? req.user.email : "public/anon",
        method: req.method,
        endpoint: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        status_code: res.statusCode,
        response_time_ms: duration,
        created_at: nowChile().toJSDate(), // 🔹 Fecha/hora Chile exacta
      });
    } catch (err) {
      console.error("❌ Error guardando log:", err.message);
    }
  });

  next();
}

module.exports = auditLogger;