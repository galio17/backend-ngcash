import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../errors";
import { IDecoded } from "../interfaces";

export const verifyTokenMiddleware: RequestHandler = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("missing authorization", 401);
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new AppError("missing token", 401);
  }

  if (!process.env.SECRET) {
    throw new Error("please provide a secret");
  }

  const secret = process.env.SECRET;
  verify(token, secret, undefined!, (err, decoded?: IDecoded) => {
    if (err) {
      throw new AppError("invalid or expired token", 401);
    }

    req.user = {
      id: decoded?.sub!,
      username: decoded?.username!,
    };
  });

  return next();
};
