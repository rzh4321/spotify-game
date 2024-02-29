"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getHighScore(
  spotifyPlaylistId: string,
  timer: number,
  userId: number,
  showHints: boolean,
): Promise<null | number> {
  // Find the playlist with the given conditions.
  const playlist = await prisma.playlist.findFirst({
    where: {
      spotifyPlaylistId,
      timer,
      showHints,
      userId,
    },
  });

  // If the playlist doesn't exist, return null.
  if (!playlist) {
    return null;
  }

  // Find the highest score for this playlist.
  const highestScorePlay = await prisma.play.findFirst({
    where: {
      playlistId: playlist.playlistId,
      userId,
    },
    orderBy: {
      score: "desc",
    },
  });

  // Return the playlist and the highest score found (if any).
  return highestScorePlay?.score ?? null;
}
