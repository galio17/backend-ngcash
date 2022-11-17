import { RequestHandler } from "express";
import { transferService } from "../../services/transactions";

export const transferController: RequestHandler = async (req, res) => {
  const history = await transferService(req.validBody, req.user.username);

  return res.status(201).json(history);
};
