import { prisma } from "../../prisma";

export const getProfileService = async (id: string) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      account: { select: { balance: true } },
    },
  });

  const profile = { ...user!, ...user!.account, account: undefined };

  return profile;
};
