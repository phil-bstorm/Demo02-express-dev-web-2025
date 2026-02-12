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

const create = async (data) => {
  // Extraction des données envoyées par le formulaire
  const { title, authorId, releaseYear } = data;

  // Vérification de si on a réçu toutes les données non-nullable
  if (!title || !authorId) {
    throw new Error("title or authorId missing");
  }

  // Vérification de si on a reçu un authorId qui EXISTE en db
  const existingAuthor = await db.Author.findOne({ where: { id: authorId } });
  if (!existingAuthor) {
    throw new Error("AuthorId doesnt exist");
  }

  // Création du livre avec les données VERIFIÉE
  const newBook = await db.Book.create({
    title,
    releaseYear,
    authorId,
  });
  return newBook;
};

export default {
  getAll,
  getById,
  create,
};
