import userService from "../services/user.service.js";

const authController = {
  register: (req, res) => {
    res.status(200).render("auth/register", {
      error: null,
    });
  },
  registerSubmit: async (req, res) => {
    // récupérer les informations du formulaire
    console.log(req.body);
    const { username, password } = req.body;
    const newUser = { username, password };

    try {
      // appeler un service pour enregistrer l'utilisateur
      await userService.create(newUser);

      // si pas de problème, on affiche login
      res.redirect("/auth/login");
    } catch (err) {
      // si problème, on réaffiche le formulaire
      res.status(400).render("auth/register", {
        error: err.message,
      });
    }
  },

  login: (req, res) => {
    res.status(200).render("auth/login", {
      error: null,
    });
  },
  loginSubmit: async (req, res) => {
    const { username, password } = req.body;
    const credential = { username, password };

    try {
      const user = await userService.login(credential);
      // Session
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };
      res.redirect("/book");
    } catch (err) {
      res.status(400).render("auth/login", {
        error: err.message,
      });
    }
  },

  logout: (req, res) => {
    // suppression de la session
    req.session.destroy();
    // redirection vers la page d'accueil
    res.redirect("/");
  },
};

export default authController;
