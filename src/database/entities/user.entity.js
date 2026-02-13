import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      //   defaultValue: "Test1234=",
      allowNull: false,
    },
  },
  {
    tableName: "users",
  },
);

export default User;
