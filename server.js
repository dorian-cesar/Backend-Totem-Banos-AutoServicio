require("dotenv").config();
const sequelize = require("./config/database");
const app = require("./app");

// 🔹 Función para listar tablas (opcional)
async function listarTablas() {
  const tables = await sequelize.getQueryInterface().showAllTables();
  console.log("Tablas en DB:", tables);
}

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected ✅");

    // Sincronizar tablas (solo crea si no existen)
    await sequelize.sync({ force: false });
    console.log("Tablas sincronizadas");

    // Listar tablas
    await listarTablas();

    // Levantar servidor
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Error al iniciar server:", err);
    process.exit(1);
  }
})();