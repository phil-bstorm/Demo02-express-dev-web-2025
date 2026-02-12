import { Router } from "express";
import bookController from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/", bookController.listing);
bookRouter.get("/create", bookController.create);
bookRouter.post("/create", bookController.createSubmit);
bookRouter.get("/:id", bookController.details);

export default bookRouter;
