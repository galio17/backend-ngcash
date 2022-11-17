import { ErrorRequestHandler } from "express";
import AppError from "../errors";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  if (err instanceof AppError) {
    const { message, statusCode } = err;

    return res.status(statusCode).json({ message });
  }

  console.error(err);
  return res.status(500).json({ message: "internal server error" });
};
