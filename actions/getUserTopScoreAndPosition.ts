"use server";
import { PrismaClient } from "@prisma/client";
import type { HighestScoreAndPosition } from "@/types";

const prisma = new PrismaClient();

export default async function getUserTopScoreAndPosition(
  spotifyPlaylistId: string | undefined,
  timer: number,
  userId: number,
  showHints: boolean,
): Promise<HighestScoreAndPosition> {
  if (!spotifyPlaylistId) return null;
  // Retrieve all plays for the given spotifyPlaylistId, timer, and showHints, ordered by score descending.
  const plays = await prisma.play.findMany({
    where: {
      playlist: {
        spotifyPlaylistId,
        timer,
        showHints,
      },
    },
    orderBy: {
      score: "desc",
    },
    include: {
      playlist: true, // Include the related playlist data.
    },
  });

  if (plays.length === 0) {
    return null; // No plays match the criteria (no one has ever played this playlist)
  }

  // Find the highest score by the specific user.
  const highestUserPlay = plays.find((play) => play.userId === userId);

  if (!highestUserPlay) {
    return null; // User never played this playlist
  }

  // Calculate the position of the user's highest score.
  const position =
    plays.findIndex((play) => play.playId === highestUserPlay.playId) + 1;

  return {
    score: highestUserPlay.score,
    timestamp: highestUserPlay.createdAt,
    position,
  };
}
