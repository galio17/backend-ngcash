import { Router } from "express";
import { errorHandlerMiddleware } from "../middlewares";
import usersRouter from "./users.routes";

const router = Router();

router.use("/users", usersRouter);
router.use(errorHandlerMiddleware);

export default router;
