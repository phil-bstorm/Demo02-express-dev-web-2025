const books = [
  {
    id: 1,
    title: "Le Seigneur des Anneaux",
    releaseYear: 1954,
  },
  {
    id: 2,
    title: "Harry Potter à l'école des sorciers",
    releaseYear: 1997,
  },
  {
    id: 3,
    title: "Le Trône de Fer",
    releaseYear: 1996,
  },
  {
    id: 4,
    title: "Le Comte de Monte-Cristo",
    releaseYear: 1844,
  },
  {
    id: 5,
    title: "1984",
    releaseYear: 1949,
  },
  {
    id: 6,
    title: "Dune",
    releaseYear: 1965,
  },
  {
    id: 7,
    title: "L'Alchimiste",
    releaseYear: 1988,
  },
  {
    id: 8,
    title: "Le Petit Prince",
    releaseYear: 1943,
  },
  {
    id: 9,
    title: "Fondation",
    releaseYear: 1951,
  },
];

const bookController = {
  listing: (req, res) => {
    res.status(200).render("book/listing", {
      books: books,
    });
  },

  details: (req, res) => {
    const id = +req.params.id;

    console.log(id);

    const book = books.find((b) => b.id === id);
    if (!book) {
      res.status(404).send("Book not found.");
      return;
    }

    res.render("book/details", { book });
  },
};

export default bookController;
