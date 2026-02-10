import { Router } from "express";
import bookController from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/", bookController.listing);
bookRouter.get("/:id", bookController.details);

export default bookRouter;
