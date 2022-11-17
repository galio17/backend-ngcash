import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import AppError from "../../errors";
import { IUserRequest } from "../../interfaces";
import { prisma } from "../../prisma";

export const createUserService = async (userReq: IUserRequest) => {
  try {
    const data = {
      ...userReq,
      account: {
        create: {
          balance: 100,
        },
      },
    };

    const select = {
      id: true,
      username: true,
      account: {
        select: { balance: true },
      },
    };

    const user = await prisma.users.create({ data, select });
    const newUser = { ...user, ...user.account, account: undefined };

    return newUser;
  } catch (err) {
    if (!(err instanceof PrismaClientKnownRequestError)) {
      throw err;
    }

    if (!err.message.includes("Unique constraint")) {
      throw err;
    }

    if (!err.message.includes("username")) {
      throw err;
    }

    throw new AppError("username is already exist", 409);
  }
};
