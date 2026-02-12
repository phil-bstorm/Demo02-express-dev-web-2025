import bookService from "../services/book.service.js";

const bookController = {
  listing: async (req, res) => {
    const { title, releaseYear } = req.query;

    const books = await bookService.getAll({ title, releaseYear });

    res.status(200).render("book/listing", {
      books: books,
      search: {
        title,
        releaseYear,
      },
    });
  },

  details: async (req, res) => {
    console.log(`   --🚨 DETAILS 🚨--`);
    const id = +req.params.id;

    console.log(id);
    const book = await bookService.getById(id);

    if (!book) {
      res.status(404).send("Book not found.");
      return;
    }

    res.render("book/details", { book });
  },

  // Affiche le formulaire
  create: (req, res) => {
    res.status(200).render("book/create", { error: null });
  },

  // Récupère les information du formulaire
  createSubmit: async (req, res) => {
    console.log(req.body);

    try {
      const book = await bookService.create(req.body);
    } catch (err) {
      res.status(400).render("book/create", {
        error: err.message,
      });
      return;
    }

    res.redirect("/book");
  },
};

export default bookController;
