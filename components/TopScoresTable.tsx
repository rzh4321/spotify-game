import getTopScoresByPlaylistIdAndTimer from "@/actions/getTopScoresByPlaylistIdAndTimer";
import getUserTopScoreAndPosition from "@/actions/getUserTopScoreAndPosition";
import { useState, useEffect } from "react";
import { FlipHorizontal, Loader } from "lucide-react";
import type { ScoreEntry, HighestScoreAndPosition } from "@/types";
import { v4 as uuidv4 } from "uuid";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TopScoresTableProps = {
  playlistId: string | undefined;
  timer: number;
  userId: number;
};

function formatDateString(dateString: string): string {
  const months: { [key: string]: number } = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const [dayOfWeek, month, day, year] = dateString.split(" ");
  const monthNumber = months[month];
  const shortYear = year.slice(2);

  // Format the date string as "M/D/YY"
  return `${monthNumber}/${day}/${shortYear}`;
}

export default function TopScoresTable({
  playlistId,
  timer,
  userId,
}: TopScoresTableProps) {
  const [showHintsLeaderboard, setShowHintsLeaderboard] = useState(false);
  const [topHints, setTopHints] = useState<ScoreEntry[]>([]);
  const [topNoHints, setTopNoHints] = useState<ScoreEntry[]>([]);
  const [userTopScoreHints, setUserTopScoreHints] =
    useState<HighestScoreAndPosition | null>(null);
  const [userTopScoreNoHints, setUserTopScoreNoHints] =
    useState<HighestScoreAndPosition | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getTopScores() {
      const data = await getTopScoresByPlaylistIdAndTimer(playlistId, timer);
      if (data) {
        const { topScoresWithHints, topScoresWithoutHints } = data;
        setTopHints(topScoresWithHints);
        setTopNoHints(topScoresWithoutHints);
      }
      const userScoreNoHints = await getUserTopScoreAndPosition(
        playlistId,
        timer,
        userId,
        false,
      );
      setUserTopScoreNoHints(userScoreNoHints);
      const userScoreHints = await getUserTopScoreAndPosition(
        playlistId,
        timer,
        userId,
        true,
      );
      setUserTopScoreHints(userScoreHints);
      // user top scores are either null (never played) or an object
      setLoading(false);
    }
    if (playlistId) getTopScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col mb-2">
      <div className="relative flex items-center justify-center">
        <TableCaption className="text-xs">{`Top Scores ${showHintsLeaderboard ? "w/" : "w/o"} Hints (${timer}s)`}</TableCaption>
        <FlipHorizontal
          className="absolute right-0 bottom-0 cursor-pointer"
          size={20}
          onClick={() => setShowHintsLeaderboard((prev) => !prev)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead className="w-[100px] text-xs">Username</TableHead>
            <TableHead className="text-xs">Score</TableHead>
            <TableHead className="text-xs">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showHintsLeaderboard ? (
            topHints.length > 0 ? (
              topHints.map((entry, ind) => (
                <TableRow
                  key={uuidv4()}
                  className={entry.id === userId ? "bg-green-700" : ""}
                >
                  <TableCell className="text-xs">{ind + 1}</TableCell>
                  <TableCell className="text-xs">{entry.name}</TableCell>
                  <TableCell className="text-xs">{entry.score}</TableCell>
                  <TableCell className="text-xs">
                    {formatDateString(entry.timestamp.toDateString())}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-xs" colSpan={4}>
                  Be the first to play this playlist!
                </TableCell>
              </TableRow>
            )
          ) : topNoHints.length > 0 ? (
            topNoHints.map((entry, ind) => (
              <TableRow
                key={uuidv4()}
                className={entry.id === userId ? "bg-green-700" : ""}
              >
                <TableCell className="text-xs">{ind + 1}</TableCell>
                <TableCell className="text-xs">{entry.name}</TableCell>
                <TableCell className="text-xs">{entry.score}</TableCell>
                <TableCell className="text-xs">
                  {formatDateString(entry.timestamp.toDateString())}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-xs" colSpan={4}>
                Be the first to play this playlist!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-xs">
              {showHintsLeaderboard
                ? userTopScoreHints
                  ? userTopScoreHints.position
                  : "N/A"
                : userTopScoreNoHints
                  ? userTopScoreNoHints.position
                  : "N/A"}
            </TableCell>
            <TableCell className="text-xs">You</TableCell>
            <TableCell className="text-xs">
              {showHintsLeaderboard
                ? userTopScoreHints
                  ? userTopScoreHints.score
                  : "N/A"
                : userTopScoreNoHints
                  ? userTopScoreNoHints.score
                  : "N/A"}
            </TableCell>
            <TableCell className="text-xs">
              {showHintsLeaderboard
                ? userTopScoreHints
                  ? formatDateString(userTopScoreHints.timestamp.toDateString())
                  : "N/A"
                : userTopScoreNoHints
                  ? formatDateString(
                      userTopScoreNoHints.timestamp.toDateString(),
                    )
                  : "N/A"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
