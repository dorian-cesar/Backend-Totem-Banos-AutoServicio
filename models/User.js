const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { nowChileSQL } = require("../utils/time");
const Role = require("./Role");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => nowChileSQL(),
  },
}, {
  tableName: "users",
  timestamps: false,
});

// 🔹 Relaciones
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Role.hasMany(User, { foreignKey: "role_id", as: "users" });

module.exports = User;