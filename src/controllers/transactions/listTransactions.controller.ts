import { RequestHandler } from "express";
import { listTransactionsService } from "../../services/transactions";

export const listTransactionsController: RequestHandler = async (req, res) => {
  const history = await listTransactionsService(req.user.account);

  return res.status(200).json(history);
};
