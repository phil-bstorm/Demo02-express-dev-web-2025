import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Book = sequelize.define(
  "Books",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "book",
  },
);

export default Book;
