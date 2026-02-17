import "dotenv/config";

import express from "express";
import morgan from "morgan";
import session from "express-session";

import db from "./database/index.js";

import homeRouter from "./routers/home.router.js";
import bookRouter from "./routers/book.router.js";
import authRouter from "./routers/auth.router.js";
import { ejsSession } from "./middlewares/ejs-session.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const { SESSION_SECRET } = process.env;

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

//Session
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  }),
);
app.use(ejsSession);

// // route de base (endpoint)
// app.get("/", (req, res) => {
//   res.status(200).render("home/index");
// });

app.use("/", homeRouter);
app.use("/book", bookRouter);
app.use("/auth", authRouter);

// Middleware de gestion d'erreur
app.use(errorHandler);

// Démarrage du serveur web
app.listen(8080, () => {
  console.log("Web server available at http://localhost:8080");
});
