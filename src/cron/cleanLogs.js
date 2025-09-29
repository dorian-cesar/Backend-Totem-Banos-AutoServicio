const cron = require('node-cron');
const pool = require('../config/db');

// Ejecutar todos los días a las 3 AM
cron.schedule('0 3 * * *', async () => {
  try {
    const [result] = await pool.query(
      `DELETE FROM api_logs WHERE created_at < NOW() - INTERVAL 90 DAY`
    );
    console.log(`🧹 Limpieza de logs: ${result.affectedRows} registros eliminados`);
  } catch (err) {
    console.error("❌ Error al limpiar logs:", err.message);
  }
});
