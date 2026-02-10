import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Author = sequelize.define(
  "Authors",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "author",
  },
);

export default Author;
