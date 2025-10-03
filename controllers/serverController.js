// controllers/serverController.js
const os = require("os");
const sequelize = require("../config/database");

exports.getServerStats = async (req, res) => {
  try {
    // Estado básico del servidor
    const uptime = process.uptime(); // en segundos
    const memoryUsage = process.memoryUsage();
    const loadAvg = os.loadavg(); // Promedio de carga (1, 5, 15 min)

    // Verificar DB
    let dbStatus = "offline";
    try {
      await sequelize.authenticate();
      dbStatus = "online";
    } catch (err) {
      dbStatus = "offline";
    }

    res.json({
      ok: true,
      server: {
        status: "running",
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        node_version: process.version,
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
      resources: {
        memory: {
          rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
        load: {
          "1m": loadAvg[0].toFixed(2),
          "5m": loadAvg[1].toFixed(2),
          "15m": loadAvg[2].toFixed(2),
        },
      },
      database: {
        status: dbStatus,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Error obteniendo estadísticas", detail: error.message });
  }
};
