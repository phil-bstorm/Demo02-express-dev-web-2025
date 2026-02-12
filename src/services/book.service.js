import { Op } from "sequelize";
import db from "../database/index.js";

const getAll = async (filters) => {
  const where = {};
  if (filters) {
    if (filters.title) {
      where.title = {
        [Op.iLike]: `%${filters.title}%`,
      };
    }

    if (filters.releaseYear) {
      where.releaseYear = filters.releaseYear;
    }
  }

  const books = await db.Book.findAll({
    where,
    include: [
      {
        model: db.Author,
        as: "author",
      },
    ],
  });

  return books;
};

const getById = async (lookingForId) => {
  const book = await db.Book.findOne({
    where: {
      id: lookingForId,
    },
  });
  return book;
};

export default {
  getAll,
  getById,
};
