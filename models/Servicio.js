const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { nowChileSQL } = require("../utils/time");

const Servicio = sequelize.define("Servicio", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.INTEGER, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => nowChileSQL(),
  },
}, {
  tableName: "servicios",
  timestamps: false,
});

module.exports = Servicio;