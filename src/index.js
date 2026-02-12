import "dotenv/config";

import express from "express";
import morgan from "morgan";

import db from "./database/index.js";

import homeRouter from "./routers/home.router.js";
import bookRouter from "./routers/book.router.js";

await db.sequelize.authenticate();

// TODO ENLEVER QUAND ON PASSE EN PROD!!!!!
await db.sequelize.sync({ alter: true });

// Création du seveur web
const app = express();

// Configurer son moteur de rendu (vue)
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Configuration des fichiers statiques
app.use(express.static("public"));

// Middleware pour les formulaires
// permettre de traiter les requêtes -> application/x-www-urlencoded
app.use(express.urlencoded({ extended: true }));

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
