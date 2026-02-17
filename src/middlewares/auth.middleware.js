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
