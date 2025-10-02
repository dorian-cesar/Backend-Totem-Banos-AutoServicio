const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const { nowChileSQL } = require("../utils/time");

const ApiLog = sequelize.define("ApiLog", {
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  user_email: { type: DataTypes.STRING, allowNull: true },
  method: { type: DataTypes.STRING, allowNull: false },
  endpoint: { type: DataTypes.STRING, allowNull: false },
  ip: { type: DataTypes.STRING, allowNull: false },
  status_code: { type: DataTypes.INTEGER, allowNull: false },
  response_time_ms: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => nowChileSQL(),
  },
}, {
  tableName: "api_logs",
  timestamps: false,
});

ApiLog.belongsTo(User, { foreignKey: "user_id" });

module.exports = ApiLog;