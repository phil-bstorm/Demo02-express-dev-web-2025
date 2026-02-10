import sequelize from "./config.js";

import Author from "./entities/author.entity.js";
import Book from "./entities/book.entity.js";
import User from "./entities/user.entity.js";

Book.belongsTo(Author, {
  as: "author",
  foreignKey: {
    allowNull: false,
  },
});

Author.hasMany(Book, {
  as: "books",
  foreignKey: "authorId",
});

User.belongsToMany(Book, {
  through: "user_borrow_book",
  as: "booksBorrow",
  foreignKey: "userId",
  otherKey: "bookId",
});
Book.belongsToMany(User, {
  through: "user_borrow_book",
  as: "usersBorrow",
  foreignKey: "bookId",
  otherKey: "userId",
});

export default {
  sequelize,
  Author,
  Book,
  User,
};
