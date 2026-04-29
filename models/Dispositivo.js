const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Dispositivo = sequelize.define("Dispositivo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  identificador: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
}, {
  tableName: "dispositivos",
  timestamps: false,
});

module.exports = Dispositivo;
