// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// 🔹 Procesar orígenes desde .env
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir llamadas internas (sin header Origin, como Postman o curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});

require('./cron/cleanLogs');
