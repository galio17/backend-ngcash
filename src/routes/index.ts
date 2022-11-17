import { Router } from "express";
import { errorHandlerMiddleware } from "../middlewares";
import sessionsRouter from "./sessions.routes";
import transactionsRouter from "./transactions.routes";
import usersRouter from "./users.routes";

const router = Router();

router.use(sessionsRouter);
router.use("/users", usersRouter);
router.use("/transactions", transactionsRouter);
router.use(errorHandlerMiddleware);

export default router;
