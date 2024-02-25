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
  playlistId: string;
  gameTimer: number;
  timer: number;
  userId: number;
  showHints: boolean;
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
  showHints,
  gameTimer,
}: TopScoresTableProps) {
  const [showHintsLeaderboard, setShowHintsLeaderboard] = useState(showHints);
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
    getTopScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggling "Show Hints" checkbox will display correct leaderboard
  useEffect(() => {
    setShowHintsLeaderboard(showHints);
  }, [showHints]);
  if (loading) return <Loader className="animate-spin" />;

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center justify-center">
        <TableCaption className="text-md">{`Top Scores ${showHintsLeaderboard ? "w/" : "w/o"} Hints (${timer}s)`}</TableCaption>
        <FlipHorizontal
          className="absolute right-0 bottom-1 cursor-pointer"
          size={20}
          onClick={() => setShowHintsLeaderboard((prev) => !prev)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead className="w-[100px]">Username</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showHintsLeaderboard ? (
            topHints.length > 0 ? (
              topHints.map((entry, ind) => (
                <TableRow key={uuidv4()}>
                  <TableCell>{ind + 1}</TableCell>
                  <TableCell className="font-medium">
                    {entry.username}
                  </TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>
                    {formatDateString(entry.timestamp.toDateString())}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  Be the first to play this playlist!
                </TableCell>
              </TableRow>
            )
          ) : topNoHints.length > 0 ? (
            topNoHints.map((entry, ind) => (
              <TableRow key={uuidv4()}>
                <TableCell>{ind + 1}</TableCell>
                <TableCell className="font-medium">{entry.username}</TableCell>
                <TableCell>{entry.score}</TableCell>
                <TableCell>
                  {formatDateString(entry.timestamp.toDateString())}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                Be the first to play this playlist!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow
            className={
              timer === gameTimer && showHints === showHintsLeaderboard
                ? "bg-green-700"
                : ""
            }
          >
            <TableCell>
              {showHintsLeaderboard
                ? userTopScoreHints
                  ? userTopScoreHints.position
                  : "N/A"
                : userTopScoreNoHints
                  ? userTopScoreNoHints.position
                  : "N/A"}
            </TableCell>
            <TableCell>You</TableCell>
            <TableCell>
              {showHintsLeaderboard
                ? userTopScoreHints
                  ? userTopScoreHints.score
                  : "N/A"
                : userTopScoreNoHints
                  ? userTopScoreNoHints.score
                  : "N/A"}
            </TableCell>
            <TableCell>
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
