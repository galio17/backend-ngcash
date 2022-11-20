import { prisma } from "../../prisma";

export const listTransactionsService = async (account: string) => {
  const transactions = await prisma.transactions.findMany({
    where: {
      OR: [{ creditedAccountId: account }, { debitedAccountId: account }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      creditedAccount: {
        select: { user: true },
      },
      debitedAccount: {
        select: { user: true },
      },
    },
  });

  const history = transactions.map((element) => {
    const { id, creditedAccount, debitedAccount, value, createdAt } = element;
    const from = debitedAccount.user!.username;
    const to = creditedAccount.user!.username;
    const releaseDate = createdAt;

    return { id, from, to, value, releaseDate };
  });

  return history;
};
