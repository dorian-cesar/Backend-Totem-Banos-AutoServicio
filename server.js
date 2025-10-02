// server.js
require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");

// 🔹 Importar todos los modelos antes de sync
require("./models/User");
require("./models/Servicio");
require("./models/ApiLog"); // tu modelo ApiLog

// 🔹 Inicializar Express
const app = express();
app.use(express.json());

// 🔹 Rutas
const authRoutes = require("./routes/authRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
app.use("/auth", authRoutes);
app.use("/api/servicios", servicioRoutes);

// 🔹 Health check
app.get("/", (req, res) => res.json({ ok: true }));

// 🔹 Función para listar tablas (opcional)
async function listarTablas() {
  const tables = await sequelize.getQueryInterface().showAllTables();
  console.log("Tablas en DB:", tables);
}

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected ✅");

    // Sincronizar tablas (solo crea si no existen)
    await sequelize.sync({ force: false });
    console.log("Tablas sincronizadas");

    // Listar tablas para verificación
    await listarTablas();

    // Levantar servidor
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error al iniciar server:", err);
    process.exit(1);
  }
})();
