const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { nowChileSQL } = require("../utils/time");

const Role = sequelize.define("Role", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => nowChileSQL(),
  },
}, {
  tableName: "roles",
  timestamps: false,
});

module.exports = Role;