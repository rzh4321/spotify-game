'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ScoreEntry = {
  score: number;
  timestamp: Date;
  username: string;
}

export default async function getTopScoresByPlaylistIdAndTimer(
  spotifyPlaylistId: string
): Promise<{ topScoresWithHints: ScoreEntry[]; topScoresWithoutHints: ScoreEntry[] } | null> {
  // Find all playlists with the given spotifyPlaylistId
  const playlists = await prisma.playlist.findMany({
    where: {
      spotifyPlaylistId: spotifyPlaylistId,
    },
    include: {
      plays: {
        include: {
          user: true,
        },
      },
    },
  });

  // If there are no playlists, return null
  if (playlists.length === 0) {
    return null;
  }

  // Flatten all plays from all playlists
  const allPlays = playlists.flatMap(playlist => playlist.plays);

  // Filter and sort the plays for showHints = false
  const topScoresWithoutHints = allPlays
    .filter(play => !play.playlist.showHints)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(play => ({
      score: play.score,
      timestamp: play.createdAt,
      username: play.user.username,
    }));

  // Filter and sort the plays for showHints = true
  const topScoresWithHints = allPlays
    .filter(play => play.playlist.showHints)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(play => ({
      score: play.score,
      timestamp: play.createdAt,
      username: play.user.username,
    }));

  return {
    topScoresWithHints,
    topScoresWithoutHints,
  };
}