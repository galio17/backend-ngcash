import AppError from "../../errors";
import { prisma } from "../../prisma";

export const getTransactionService = async (id: string, account: string) => {
  const transaction = await prisma.transactions.findFirst({
    where: {
      AND: { id },
      OR: [{ creditedAccountId: account }, { debitedAccountId: account }],
    },
    include: {
      creditedAccount: { select: { user: true } },
      debitedAccount: { select: { user: true } },
    },
  });

  if (!transaction) {
    throw new AppError("transaction not found in own list", 404);
  }

  const {
    debitedAccount,
    creditedAccount,
    value,
    createdAt: releaseDate,
  } = transaction;
  const { username: to } = creditedAccount.user!;
  const { username: from } = debitedAccount.user!;

  const history = {
    id,
    from,
    to,
    value,
    releaseDate,
  };

  return history;
};
