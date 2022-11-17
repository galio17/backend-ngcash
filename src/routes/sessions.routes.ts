import { Router } from "express";
import { getProfileController, loginController } from "../controllers/sessions";
import {
  validateSchemaMiddleware,
  verifyTokenMiddleware,
} from "../middlewares";
import { loginSchema } from "../schemas/sessions";

const sessionsRouter = Router();

sessionsRouter.post(
  "/login",
  validateSchemaMiddleware(loginSchema),
  loginController
);

sessionsRouter.get("/profile", verifyTokenMiddleware, getProfileController);

export default sessionsRouter;
