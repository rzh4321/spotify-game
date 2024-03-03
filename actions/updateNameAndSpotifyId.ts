"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function updateNameAndSpotifyId(
  username: string,
  name: string,
  spotifyId: string | undefined,
): Promise<void> {
  if (!name) {
    throw new Error("Name is required");
  }
  // Start a transaction to ensure data consistency
  const result = await prisma.$transaction(async (prisma) => {
    let user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: {
          username: user.username,
        },
        data: {
          name: name,
          spotifyUserId: spotifyId ?? null,
        },
      });
      console.log("update success. the updated user is now ", updatedUser);
    } else {
      console.log("cant find user ", username);
      throw new Error("Unable to find user");
    }
  });
}
