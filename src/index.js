import express from "express";
import morgan from "morgan";
import homeRouter from "./routers/home.router.js";
import bookRouter from "./routers/book.router.js";

// Création du seveur web
const app = express();

// Configurer son moteur de rendu (vue)
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Logger middleware
app.use(morgan("tiny"));

// // route de base (endpoint)
// app.get("/", (req, res) => {
//   res.status(200).render("home/index");
// });

app.use("/", homeRouter);
app.use("/book", bookRouter);

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .send("Une erreur s'est produite, veuillez réessayer plus tard.");
});

// Démarrage du serveur web
app.listen(8080, () => {
  console.log("Web server available at http://localhost:8080");
});
