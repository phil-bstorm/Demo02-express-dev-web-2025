import { Router } from "express";
import bookController from "../controllers/book.controller.js";
import { connected } from "../middlewares/auth.middleware.js";

const bookRouter = Router();

bookRouter.get("/", bookController.listing);
bookRouter.get("/create", connected(true), bookController.create);
bookRouter.post("/create", connected(true), bookController.createSubmit);
bookRouter.get("/:id", bookController.details);

export default bookRouter;
