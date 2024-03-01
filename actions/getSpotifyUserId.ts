"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getSpotifyUserId(
  username: string,
): Promise<string | undefined> {
  if (!username) return undefined;
  // Retrieve the user with the given username
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      spotifyUserId: true, // Only select the spotifyUserId field
    },
  });

  // If the user exists, return the spotifyUserId, else return null
  return user?.spotifyUserId ?? undefined;
}
