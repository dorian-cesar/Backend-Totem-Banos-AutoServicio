const express = require("express");
const cors = require("cors");
const auditLogger = require("./middlewares/auditLogger");

// 🔹 Importar modelos para que Sequelize los registre
require("./models/User");
require("./models/Servicio");
require("./models/ApiLog");
require("./cron/limpiezaLogs");

const app = express();
app.use(express.json());

// 🔹 Configuración de CORS
const corsOptions =
  process.env.NODE_ENV === "development"
    ? { origin: "*" } // 🔓 Permite todos los orígenes en desarrollo
    : { origin: process.env.CORS_ORIGIN?.split(",") || [], credentials: true };

app.use(cors(corsOptions));

// 🔹 Middleware de logger
app.use(auditLogger);

// 🔹 Rutas
const authRoutes = require("./routes/authRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// 🔹 Health check
app.get("/", (req, res) => res.json({ ok: true }));

module.exports = app;