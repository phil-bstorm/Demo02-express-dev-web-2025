import db from "../database/index.js";

const getAll = async () => {
  const books = await db.Book.findAll({
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
