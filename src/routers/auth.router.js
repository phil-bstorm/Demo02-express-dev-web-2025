import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

// get = (affichage de la) page du formulaire
authRouter.get("/register", authController.register);
// post = récupéreration du formulaire
authRouter.post("/register", authController.registerSubmit);
authRouter.get("/login", authController.login);
authRouter.post("/login", authController.loginSubmit);

export default authRouter;
