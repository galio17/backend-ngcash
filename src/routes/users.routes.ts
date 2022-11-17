import { Router } from "express";
import { createUserController } from "../controllers/users/createUser.controller";
import { validateSchemaMiddleware } from "../middlewares";
import { createUserSchema } from "../schemas/users";

const usersRouter = Router();

usersRouter.post(
  "/",
  validateSchemaMiddleware(createUserSchema),
  createUserController
);

export default usersRouter;
