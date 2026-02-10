import bookService from "../services/book.service.js";

const bookController = {
  listing: async (req, res) => {
    const books = await bookService.getAll();

    res.status(200).render("book/listing", {
      books: books,
    });
  },

  details: async (req, res) => {
    const id = +req.params.id;

    console.log(id);
    const book = await bookService.getById(id);

    if (!book) {
      res.status(404).send("Book not found.");
      return;
    }

    res.render("book/details", { book });
  },
};

export default bookController;
