import { Router } from "express";
import { loginController } from "../controllers/sessions/login.controller";
import { validateSchemaMiddleware } from "../middlewares";
import { loginSchema } from "../schemas/sessions";

const sessionsRouter = Router();

sessionsRouter.post(
  "/login",
  validateSchemaMiddleware(loginSchema),
  loginController
);

export default sessionsRouter;
