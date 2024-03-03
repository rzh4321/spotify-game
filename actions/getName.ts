"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getName(
  username: string,
): Promise<string | undefined> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  return user?.name;
}
