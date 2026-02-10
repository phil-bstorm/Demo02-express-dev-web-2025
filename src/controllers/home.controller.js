const homeController = {
  index: (req, res) => {
    res.status(200).render("home/index");
  },
  about: (req, res) => {
    res.status(200).render("home/about");
  },
};

export default homeController;
