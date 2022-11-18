import { Router } from "express";
import {
  listTransactionsController,
  transferController,
} from "../controllers/transactions";
import {
  validateSchemaMiddleware,
  verifyTokenMiddleware,
} from "../middlewares";
import { transferSchema } from "../schemas/transactions";

const transactionsRouter = Router();

transactionsRouter.get("", verifyTokenMiddleware, listTransactionsController);

transactionsRouter.post(
  "/transfer",
  verifyTokenMiddleware,
  validateSchemaMiddleware(transferSchema),
  transferController
);

export default transactionsRouter;
