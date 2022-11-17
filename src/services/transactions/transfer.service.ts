import AppError from "../../errors";
import { ITransferRequest } from "../../interfaces";
import { prisma } from "../../prisma";

export const transferService = async (
  { to, value }: ITransferRequest,
  from: string
) => {
  if (from === to) {
    throw new AppError("cant transfer to yourself", 403);
  }

  const creditedUser = await prisma.accounts.findFirst({
    where: { user: { username: to } },
  });

  if (!creditedUser) {
    throw new AppError("User not found", 404);
  }

  const debitedUser = await prisma.accounts.findFirst({
    where: { user: { username: from } },
  });

  if (value > debitedUser!.balance) {
    throw new AppError("balance insufficient to transfer", 403);
  }

  const createTransaction = prisma.transactions.create({
    data: {
      value,
      creditedAccountId: creditedUser.id,
      debitedAccountId: debitedUser!.id,
    },
  });
  const updateCreditedUser = prisma.accounts.update({
    where: { id: debitedUser!.id },
    data: { balance: debitedUser!.balance + value },
  });
  const updateDebitedUser = prisma.accounts.update({
    where: { id: creditedUser.id },
    data: { balance: creditedUser.balance - value },
  });

  const [transaction] = await prisma.$transaction([
    createTransaction,
    updateCreditedUser,
    updateDebitedUser,
  ]);

  const history = {
    id: transaction.id,
    from,
    to,
    value,
    releaseDate: transaction.createdAt,
  };

  return history;
};
