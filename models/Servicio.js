const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Servicio = sequelize.define("Servicio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING },
  precio: { type: DataTypes.DECIMAL(10,2) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "servicios",
  timestamps: false
});

module.exports = Servicio;
