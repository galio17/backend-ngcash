import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import AppError from "../../errors";
import { IUserRequest } from "../../interfaces";
import { prisma } from "../../prisma";

export const loginService = async ({ username, password }: IUserRequest) => {
  const user = await prisma.users.findUnique({ where: { username } });

  if (!user) {
    throw new AppError("username or password dont match", 401);
  }

  const checkPassword = await compare(password, user.password);
  if (!checkPassword) {
    throw new AppError("username or password dont match", 401);
  }

  if (!process.env.SECRET) {
    throw new Error("please provide a secret");
  }

  const secret = process.env.SECRET;
  const token = sign({ username, account: user.accountId }, secret, {
    expiresIn: "24h",
    subject: user.id,
  });

  return { token };
};
