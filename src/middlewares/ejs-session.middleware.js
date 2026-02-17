export const ejsSession = (req, res, next) => {
  res.locals.session = req.session;
  next();
};
