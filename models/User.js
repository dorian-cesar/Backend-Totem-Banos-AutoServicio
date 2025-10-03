const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./Role");
const { nowChileSQL } = require("../utils/time");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => nowChileSQL(),
    },
  },
  {
    tableName: "users",
    timestamps: false,
    defaultScope: { attributes: { exclude: ["password_hash"] } },
    scopes: { withPassword: { attributes: { include: ["password_hash"] } } },
  }
);

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

module.exports = User;