const cron = require("node-cron");
const sequelize = require("../config/database");

async function limpiarLogs() {
  try {
    const [results, metadata] = await sequelize.query(`
      DELETE FROM banos_autoservicio.api_logs
      WHERE created_at < NOW() - INTERVAL '90 days'
    `);

    console.log(`🧹 Logs eliminados: ${metadata.rowCount || 0}`);
  } catch (err) {
    console.error("❌ Error al limpiar logs:", err);
  }
}

// 🔹 Programar tarea todos los días a las 03:00 AM
cron.schedule("0 3 * * *", () => {
  console.log("⏰ Ejecutando limpieza de logs (90+ días)...");
  limpiarLogs();
});

module.exports = limpiarLogs;
