import { Router } from "express";
import { transferController } from "../controllers/transactions/transfer.controller";
import {
  validateSchemaMiddleware,
  verifyTokenMiddleware,
} from "../middlewares";
import { transferSchema } from "../schemas/transactions";

const transactionsRouter = Router();

transactionsRouter.post(
  "/transfer",
  verifyTokenMiddleware,
  validateSchemaMiddleware(transferSchema),
  transferController
);

export default transactionsRouter;
