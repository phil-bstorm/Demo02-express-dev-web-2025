# Express

## Structure du projet

### Dossiers principaux

- `public/`: Contient les fichiers statiques accessibles directement par le navigateur (images, CSS, fichiers JavaScript côté client).
- `src/`: Le cœur de l'application, contenant tout le code source de l'application, y compris les routes, les contrôleurs, les modèles, etc.

### Logique backend (`src/`)

- `controllers/`:Contient la logique de traitement. Il reçoit les requêtes, appelle les services nécessaires et renvoie la réponse (souvent en rendant une vue ou résultat json).
- `database/`:
  - `entities/`: Définit la structure des données (schémas pour une base de données comme SQL ou NoSQL).
  - `config.js`: Configuration de l'instance de la base de données (connexion, paramètres, etc.).
  - `index.js`: Import de la configuration, des entités et des relations, et export de l'instance de la base de données pour une utilisation dans d'autres parties de l'application.
- `middlewares/`: Contient les middlewares personnalisés pour gérer des fonctionnalités transversales (par exemple, l'authentification, la gestion des erreurs, etc.).
- `routers/`: Contient les définitions des routes de l'application. Chaque route est associée à un contrôleur qui gère la logique de traitement pour cette route.
- `services/`: Contient la logique métier de l'application. Les services sont appelés par les contrôleurs pour effectuer des opérations spécifiques (par exemple, interagir avec la base de données, effectuer des calculs, etc.).
- `views/`: Contient les fichiers de vue (par exemple, des templates HTML) qui sont rendus par les contrôleurs pour générer la réponse envoyée au client.

### Fichiers de configuration

- `.env`: Contient les variables d'environnement pour la configuration de l'application (par exemple, les informations de connexion à la base de données, les clés API, etc.). ⚠️ Ne jamais committer ce fichier dans un dépôt public. Pensez au `.gitignore` pour éviter de le faire.
- `package.json`: Contient les métadonnées du projet, les dépendances, les scripts de démarrage, etc.

## Plan de développement

Ce plan de développement est une feuille de route pour construire une application web avec Express, en suivant une architecture MVC (Model-View-Controller) et en utilisant Sequelize pour interagir avec une base de données PostgreSQL. Chaque étape correspond à une phase clé du développement, depuis l'initialisation du projet jusqu'à la mise en place des routes et des middlewares.

C'est aussi à vous d'adapter ce plan en fonction de vos besoins spécifiques, de la complexité de votre application et des fonctionnalités que vous souhaitez implémenter. Par exemple, si vous n'avez pas besoin d'une interface utilisateur avec des vues, vous pouvez sauter la partie "Vues" et vous concentrer uniquement sur les API RESTful. De même, si votre application nécessite une authentification, vous devrez ajouter des étapes pour gérer les utilisateurs, les sessions, et les autorisations.

### Étape 1: Initialisation et Environnement

Avant de coder la logique, il faut préparer le terrain.:

1. **Initialiser le projet** : Lancer npm init et configurer le package.json avec "type": "module" pour utiliser les imports ES6.
2. **Installer les dépendances** : Installer express, sequelize, pg (PostgreSQL), ejs, dotenv, et nodemon pour le développement.
   - Minimum: `npm i express sequelize pg pg-hstore dotenv morgan`
   - Encryption: `npm i bcrypt`
   - Dev: `npm i -D nodemon`
   - Si application MVC (Model-View-Controller): View engine: `npm i ejs express-session`
3. **Variables d'environnement** : Créer un fichier .env pour stocker les accès à la base de données (DB_USER, DB_PASSWORD, etc.) et le SESSION_SECRET.

### Étape 2: Configuration de la Base de Données (Entités/Modèles)

1. **Connexion**: Créer src/database/config.js pour initialiser l'instance Sequelize avec les variables du .env.
2. **Définition des entités (modeles/tables)**: Créer des fichiers dans src/database/entities/ pour définir les modèles (User, Book, Author...) avec leurs champs.
3. **Associations**: Configurer les relations (One-to-Many, Many-to-Many) dans src/database/index.js pour lier les Livres, Auteurs et Utilisateurs.

### Étape 3: Développement de la logique métier (Services)

Le service fait le pont entre la base de données et le reste de l'app.

1. Créer `src/services/book.service.js`.
2. Implémenter les fonctions de manipulation de données :` getAll` (avec filtres de recherche), `getById`, `create` (avec validation des données),...

### Étape 4: Création des Contrôleurs (et Vues)

Ici, on gère ce que l'utilisateur voit et fait.

1. **Contrôleurs** : Créer `src/controllers/book.controller.js`. Il appelle le service, puis utilise `res.json` pour renvoyer les données au format JSON ou `res.render()` pour envoyer les données vers une vue EJS.
2. **Vues (Templates)** : Créer les fichiers .ejs dans `src/views/book/` (listing, details, create) et les composants réutilisables comme le header et le footer.

### Étape 5: Définition des Routes

On connecte enfin les URLs aux contrôleurs.

1. **Routeurs** : Créer `src/routers/book.router.js` pour mapper les méthodes HTTP (GET, POST) aux fonctions du contrôleur.
2. **Application Express** : Dans `src/app.js` :
   - Configurer le moteur de rendu EJS.
   - Ajouter les middlewares (express.json, session, morgan).
   - **(En dev seulement)** Synchroniser la base de données avec db.sequelize`.sync()`.
   - Déclarer les routes principales (ex: `app.use("/book", bookRouter)`).

### Étape 6: Middlewares

Création des middlewares:

1. **Gestion des erreurs** : Un middleware pour capturer les erreurs et renvoyer une réponse d'erreur générique.
2. **Autorisation** : Un middleware pour vérifier si l'utilisateur est connecté et, si nécessaire, s'il a les droits d'administrateur pour accéder à certaines routes.

## Explication des différentes parties du code

### Configuration de la base de données (`src\database\config.js`)

```javascript
import { Sequelize } from "sequelize";

// Récupération des variables d'environnement pour la configuration de la base de données
const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_PORT } = process.env;

// Initialisation de l'instance Sequelize avec les paramètres de connexion
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
});

// Export de l'instance Sequelize pour une utilisation dans d'autres parties de l'application
export default sequelize;
```

Ce code initialise une connexion à une base de données PostgreSQL en utilisant Sequelize. Les paramètres de connexion sont récupérés à partir des variables d'environnement, ce qui permet de garder les informations sensibles hors du code source. L'instance Sequelize est ensuite exportée pour être utilisée dans d'autres fichiers, notamment pour définir les modèles et interagir avec la base de données.

### Définition d'une entité (modèle) (`src\database\entities\book.entity.js`)

```javascript
import { DataTypes } from "sequelize";

// Import de l'instance Sequelize configurée pour interagir avec la base de donnéess
import sequelize from "../config.js";

// Définition du modèle "Book" avec ses champs et leurs types
const Book = sequelize.define(
  // Nom du modèle
  "Books",
  // Définition des champs du modèle
  {
    id: {
      // Champ "id" de type entier
      type: DataTypes.INTEGER,
      // Ce champ est la clé primaire de la table
      primaryKey: true,
      // Ce champ s'auto-incrémente à chaque nouvel enregistrement
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      // Ce champ ne peut pas être nul
      allowNull: false,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
    },
  },
  // Options du modèle, notamment le nom de la table dans la base de données, désactivé l'ajout automatique des champs "createdAt" et "updatedAt", activé le mode "paranoid" pour la suppression logique des enregistrements...
  {
    // Activé/Désactive l'ajout automatique des champs "createdAt" et "updatedAt"
    timestamps: true,
    // Activé/Désactive le mode "paranoid" pour la suppression logique des enregistrements
    paranoid: false,
    // Nom de la table dans la base de données
    tableName: "book",
  },
);

// Export du modèle "Book" pour une utilisation dans d'autres parties de l'application
export default Book;
```

Ce code définit un modèle Sequelize pour une entité "Book". Il spécifie les champs de la table (id, title, releaseYear) avec leurs types et contraintes. Le modèle est configuré pour ne pas ajouter automatiquement les champs de timestamp et pour ne pas utiliser la suppression logique. Enfin, le modèle est exporté pour être utilisé dans d'autres parties de l'application, notamment dans les services.

### Configuration des associations entre les modèles (`src\database\index.js`)

```javascript
// Import de l'instance Sequelize configurée pour interagir avec la base de données
import sequelize from "./config.js";

// Import des modèles (entités) pour définir les associations entre eux
import Author from "./entities/author.entity.js";
import Book from "./entities/book.entity.js";
import User from "./entities/user.entity.js";

// Définition des associations entre les modèles
// Un livre appartient à un auteur (relation One-to-Many)
Book.belongsTo(Author, {
  as: "author",
  foreignKey: {
    allowNull: false,
  },
});

// Un auteur peut avoir plusieurs livres (relation One-to-Many)
Author.hasMany(Book, {
  as: "books",
  foreignKey: "authorId",
});

// Un utilisateur peut emprunter plusieurs livres et un livre peut être emprunté par plusieurs utilisateurs (relation Many-to-Many)
User.belongsToMany(Book, {
  through: "user_borrow_book",
  as: "booksBorrow",
  foreignKey: "userId",
  otherKey: "bookId",
});
// Un livre peut être emprunté par plusieurs utilisateurs et un utilisateur peut emprunter plusieurs livres (relation Many-to-Many)
Book.belongsToMany(User, {
  through: "user_borrow_book",
  as: "usersBorrow",
  foreignKey: "bookId",
  otherKey: "userId",
});

// Export de l'instance Sequelize et des modèles pour une utilisation dans d'autres parties de l'application
export default {
  sequelize,
  Author,
  Book,
  User,
};
```

Ce code configure les associations entre les modèles "Author", "Book" et "User". Il définit une relation One-to-Many entre les auteurs et les livres, ainsi qu'une relation Many-to-Many entre les utilisateurs et les livres (pour gérer les emprunts). Les associations sont configurées avec des clés étrangères et des alias pour faciliter l'accès aux données associées. Enfin, l'instance Sequelize et les modèles sont exportés pour être utilisés dans d'autres parties de l'application, notamment dans les services pour interagir avec la base de données.

### Service de gestion des livres (`src\services\book.service.js`)

```javascript
// Import de l'opérateur "Op" de Sequelize pour les opérations de comparaison dans les requêtes
import { Op } from "sequelize";
// Import de l'instance de la base de données pour accéder aux modèles et interagir avec la base de données
import db from "../database/index.js";

// Fonction pour récupérer tous les livres avec des filtres optionnels (par titre et année de sortie)
const getAll = async (filters) => {
  const where = {};

  // Si des filtres sont fournis, les ajouter à la clause "where" de la requête
  if (filters) {
    if (filters.title) {
      where.title = {
        // Utilisation de l'opérateur "iLike" pour une recherche insensible à la casse sur le titre du livre
        [Op.iLike]: `%${filters.title}%`,
      };
    }

    if (filters.releaseYear) {
      where.releaseYear = filters.releaseYear;
    }
  }

  // Requête pour récupérer tous les livres qui correspondent aux critères de recherche, en incluant les informations de l'auteur associé
  const books = await db.Book.findAll({
    where,
    // Inclusion du modèle "Author" pour récupérer les informations de l'auteur associé à chaque livre
    include: [
      {
        // Spécification du modèle "Author" à inclure dans les résultats de la requête
        model: db.Author,
        // Alias pour accéder aux informations de l'auteur dans les résultats de la requête
        as: "author",
      },
    ],
  });

  // Retourne la liste des livres récupérés de la base de données
  return books;
};

// Fonction pour récupérer un livre spécifique par son ID
const getById = async (lookingForId) => {
  const book = await db.Book.findOne({
    where: {
      id: lookingForId,
    },
  });
  return book;
};

// Fonction pour créer un nouveau livre avec les données fournies
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

// Export des fonctions du service pour une utilisation dans les contrôleurs
export default {
  getAll,
  getById,
  create,
};
```

### Contrôleur de gestion des livres (`src\controllers\book.controller.js`)

```javascript
// Import du service de gestion des livres pour interagir avec la logique métier et la base de données
import bookService from "../services/book.service.js";

// Contrôleur pour gérer les requêtes liées aux livres, notamment l'affichage de la liste des livres, les détails d'un livre spécifique, et la création d'un nouveau livre
const bookController = {
  // Affiche la liste des livres avec des filtres de recherche optionnels (par titre et année de sortie)
  listing: async (req, res) => {
    // Extraction des paramètres de recherche depuis la requête (query parameters)
    const { title, releaseYear } = req.query;

    // Appel du service pour récupérer tous les livres qui correspondent aux critères de recherche
    const books = await bookService.getAll({ title, releaseYear });

    // Rendu de la vue "book/listing" avec les livres récupérés et les critères de recherche pour les afficher dans la vue
    res.status(200).render("book/listing", {
      books: books,
      search: {
        title,
        releaseYear,
      },
    });

    // Si on voulait juste retourner les données au format JSON sans rendre une vue, on pourrait utiliser la ligne suivante à la place :
    // res.status(200).json(books);
  },

  // Affiche les détails d'un livre spécifique en fonction de son ID
  details: async (req, res) => {
    // Extraction de l'ID du livre depuis les paramètres de la requête (route parameters)
    const id = +req.params.id;

    // Appel du service pour récupérer le livre correspondant à l'ID fourni
    const book = await bookService.getById(id);

    if (!book) {
      // Si aucun livre n'est trouvé avec l'ID fourni, renvoyer une réponse 404 avec un message d'erreur
      res.status(404).send("Book not found.");
      return;
    }

    // Rendu de la vue "book/details" avec les informations du livre récupéré pour les afficher dans la vue
    res.render("book/details", { book });

    // Si on voulait juste retourner les données au format JSON sans rendre une vue, on pourrait utiliser la ligne suivante à la place :
    // res.status(200).json(book);
  },

  // Affiche le formulaire de création d'un nouveau livre
  create: (req, res) => {
    res.status(200).render("book/create", { error: null });
  },

  // Traite la soumission du formulaire de création d'un nouveau livre
  createSubmit: async (req, res) => {
    // Extraction des données envoyées par le formulaire depuis le corps de la requête
    const { title, authorId, releaseYear } = req.body;

    // Vérification de si les données non-nullable sont présentes (title et authorId)
    if (!title || !authorId) {
      // Si des données sont manquantes, renvoyer une réponse 400 avec un message d'erreur et réafficher le formulaire de création
      res.status(400).render("book/create", {
        error: "title or authorId missing",
      });
      return;
    }

    // Appel du service pour créer un nouveau livre avec les données fournies, en gérant les erreurs potentielles (par exemple, si l'authorId n'existe pas)
    try {
      const book = await bookService.create({
        title,
        authorId,
        releaseYear,
      });
    } catch (err) {
      // Si une erreur se produit lors de la création du livre (par exemple, validation des données), renvoyer une réponse 400 avec le message d'erreur et réafficher le formulaire de création
      res.status(400).render("book/create", {
        error: err.message,
      });
      return;
    }

    // Si la création du livre est réussie, rediriger l'utilisateur vers la liste des livres
    res.redirect("/book");
  },
};

// Export du contrôleur pour une utilisation dans les routeurs
export default bookController;
```

### Routeur de gestion des livres (`src\routers\book.router.js`)

```javascript
// Import du module Router d'Express pour définir les routes de l'application
import { Router } from "express";
// Import du contrôleur de gestion des livres pour associer les routes aux fonctions de traitement correspondantes
import bookController from "../controllers/book.controller.js";

// Création d'une instance de Router pour définir les routes liées aux livres
const bookRouter = Router();

// Définition des routes pour les livres, associant chaque route à la fonction correspondante du contrôleur

// Route pour afficher la liste des livres avec des filtres de recherche optionnels
bookRouter.get("/", bookController.listing);

// Route pour afficher le formulaire de création d'un nouveau livre
bookRouter.get("/create", bookController.create);
// Route pour traiter la soumission du formulaire de création d'un nouveau livre
bookRouter.post("/create", bookController.createSubmit);

// Route dynamique pour afficher les détails d'un livre en fonction de son ID, où ":id" est un paramètre de route qui sera extrait dans le contrôleur
bookRouter.get("/:id", bookController.details);
// Note: Cette route doit être définie après les routes statiques (comme "/create") pour éviter les conflits de routage, car Express traite les routes dans l'ordre de leur définition

// Export du routeur pour une utilisation dans l'application principale (app.js)
export default bookRouter;
```

### Application principale (`src\index.js`)

```javascript
// Import de la configuration des variables d'environnement pour accéder aux paramètres de configuration de l'application
import "dotenv/config";

// Import des modules nécessaires pour créer et configurer le serveur web Express, gérer les sessions et les logs
import express from "express";
import morgan from "morgan";
import session from "express-session";

// Import de l'instance de la base de données pour authentifier la connexion et synchroniser les modèles avec la base de données
import db from "./database/index.js";

// Import des routeurs pour gérer les différentes routes de l'application (home, book, auth)
import homeRouter from "./routers/home.router.js";
import bookRouter from "./routers/book.router.js";
import authRouter from "./routers/auth.router.js";

// Récupération de la variable d'environnement pour la configuration de la session
const { SESSION_SECRET } = process.env;

// Authentification de la connexion à la base de données pour vérifier que les paramètres de connexion sont corrects et que la base de données est accessible
await db.sequelize.authenticate();

// Synchronisation des modèles avec la base de données, en utilisant l'option "alter: true" pour mettre à jour la structure de la base de données sans perdre les données existantes (attention à utiliser cette option uniquement en développement, car elle peut entraîner des modifications non souhaitées en production)
await db.sequelize.sync({ alter: true }); // TODO ENLEVER QUAND ON PASSE EN PROD!!!!!

// Création du seveur web
const app = express();

// Si application MVC (Model-View-Controller) : Configuration du moteur de rendu EJS pour générer les vues HTML à partir des templates EJS, et définition du dossier où se trouvent les fichiers de vues
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Middleware pour servir les fichiers statiques (images, CSS, JavaScript côté client) depuis le dossier "public", ce qui permet au navigateur d'accéder à ces fichiers directement via des URL
app.use(express.static("public"));

// Middleware pour parser les données JSON envoyées dans le corps des requêtes HTTP, ce qui permet de traiter les données envoyées par les clients au format JSON
// // permettre de traiter les requêtes -> application/x-www-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser les données JSON envoyées dans le corps des requêtes HTTP, ce qui permet de traiter les données envoyées par les clients au format JSON
app.use(morgan("tiny"));

// Middleware pour gérer les sessions utilisateur, en utilisant une clé secrète pour signer les cookies de session et en configurant les options de sauvegarde et de réinitialisation des sessions
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  }),
);

// Middleware pour rendre les données de session disponibles dans les vues, en ajoutant les données de session à l'objet "res.locals" qui est accessible dans les templates EJS, ce qui permet d'afficher des informations liées à la session (par exemple, le nom de l'utilisateur connecté) dans les vues
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Déclaration des routes principales de l'application, en associant les routeurs correspondants à chaque chemin d'URL (home, book, auth)
app.use("/", homeRouter);
app.use("/book", bookRouter);
app.use("/auth", authRouter);

// Middleware de gestion des erreurs pour capturer les erreurs qui se produisent dans les routes et les contrôleurs, en affichant l'erreur dans la console et en renvoyant une réponse d'erreur générique au client
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
```

### Middlewares

#### Gestion des erreurs (`src\middlewares\error.middleware.js`)

Le middleware de gestion des erreurs est une fonction qui capture les erreurs qui se produisent dans les routes et les contrôleurs de l'application. Il affiche l'erreur dans la console pour le développeur et renvoie une réponse d'erreur générique au client, indiquant qu'une erreur s'est produite et invitant l'utilisateur à réessayer plus tard. Ce middleware est généralement placé à la fin de la chaîne de middlewares pour s'assurer qu'il capture toutes les erreurs non gérées qui pourraient survenir dans les routes précédentes.

```javascript
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .send("Une erreur s'est produite, veuillez réessayer plus tard.");
};
```

#### Autorisation (`src\middlewares\auth.middleware.js`)

Le middleware d'autorisation est une fonction qui vérifie si un utilisateur est connecté avant de lui permettre d'accéder à certaines routes de l'application. Il prend un paramètre `onlyAdmin` qui indique si la route est réservée aux administrateurs. Si l'utilisateur est connecté, le middleware vérifie également si la route est réservée aux administrateurs et si l'utilisateur a les droits d'administrateur nécessaires pour accéder à la route. Si l'utilisateur n'est pas connecté ou n'a pas les droits nécessaires, le middleware redirige l'utilisateur vers la page de connexion ou renvoie une réponse d'erreur appropriée.

_Attention à sa synthaxe particulière, c'est une fonction qui retourne une fonction middleware. Cela permet de passer des paramètres à notre middleware (dans ce cas, `onlyAdmin`) pour personnaliser son comportement en fonction des besoins de chaque route._

```javascript
export const connected = (onlyAdmin) => {
  return (req, res, next) => {
    // Est-ce que l'utilisateur est connecté?
    if (req.session?.user) {
      // le user est connecté
      // est-ce que la route est réservé admin?
      if (onlyAdmin) {
        // la route est réservé admin
        // est-ce que l'utilisateur est admin?
        if (req.session.user.isAdmin) {
          // L'utilisateur est admin, ok go
          next();
        } else {
          // L'utilisateur est connecté mais pas admin (route réserver admin)
          res.status(404).send("404 - tu es perdu?");
        }
      } else {
        // L'utilisateur n'est pas admin (mais cette route n'est pas réservé au admin)
        next();
      }
    } else {
      // le user n'est pas connecté
      res.redirect("/auth/login");
    }
  };
};
```
