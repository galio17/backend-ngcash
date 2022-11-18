import { RequestHandler } from "express";
import { getTransactionService } from "../../services/transactions";

export const getTransactionController: RequestHandler = async (req, res) => {
  const history = await getTransactionService(req.params.id, req.user.account);

  return res.status(200).json(history);
};
