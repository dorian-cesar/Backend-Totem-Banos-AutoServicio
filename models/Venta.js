const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Servicio = require("./Servicio");

const Venta = sequelize.define("Venta", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  usuario_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "users", key: "id" }
  },
  servicio_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "servicios", key: "id" }
  },
  monto: { type: DataTypes.INTEGER, allowNull: false },
  metodo_pago: { type: DataTypes.STRING(50), allowNull: false },
  estado: { type: DataTypes.STRING(50), defaultValue: "pendiente" },
  id_transaccion: { type: DataTypes.STRING(100) },
  codigo_autorizacion: { type: DataTypes.STRING(50) },
  codigo_comercio: { type: DataTypes.STRING(50) },
  creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "ventas",
  schema: "bano_autoservicio",
  timestamps: false
});

// Relaciones
Venta.belongsTo(User, { foreignKey: "usuario_id", as: "usuario" });
Venta.belongsTo(Servicio, { foreignKey: "servicio_id", as: "servicio" });

module.exports = Venta;