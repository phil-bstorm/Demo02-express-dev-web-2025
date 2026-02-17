export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .send("Une erreur s'est produite, veuillez réessayer plus tard.");
};
