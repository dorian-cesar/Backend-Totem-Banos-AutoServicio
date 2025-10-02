const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ApiLog = sequelize.define("ApiLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: "id" }},
  user_email: { type: DataTypes.STRING },
  method: { type: DataTypes.STRING },
  endpoint: { type: DataTypes.STRING },
  ip: { type: DataTypes.STRING },
  status_code: { type: DataTypes.INTEGER },
  response_time_ms: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "api_logs",
  timestamps: false
});

// Relación con users
ApiLog.belongsTo(User, { foreignKey: "user_id" });

module.exports = ApiLog;
