import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect } from "react";
import UpdatePlaylistAndCreatePlay from "@/actions/UpdatePlaylistAndCreatePlay";

type GameOverProps = {
  score: number;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  playlistId: string;
  timer: number;
  userId: number;
  showHints: boolean;
  correct: string;
  selected: string;
  beatHighScore: boolean;
};

export default function GameOver({
  score,
  setShowMenu,
  playlistId,
  timer,
  userId,
  showHints,
  correct,
  selected,
  beatHighScore,
}: GameOverProps) {
  useEffect(() => {
    async function updateDatabase() {
      await UpdatePlaylistAndCreatePlay(
        userId,
        playlistId,
        showHints,
        timer,
        score,
      );
    }
    updateDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // make sure its only run once to avoid updating db multiple times
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-5">
        <span>
          The song was <span className="text-green-400">{correct}</span> and you
          chose <span className="text-red-400">{selected}</span>
        </span>
        <div>
          <div className="text-center text-3xl">{score}</div>
          {beatHighScore && (
            <span className="text-xs bg-green-600 rounded text-black p-1">
              NEW BEST
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Button className="bg-green-400" onClick={() => setShowMenu(true)}>
          Play again
        </Button>
        <Link href="/home">
          <Button className="bg-red-400">Back to playlists</Button>
        </Link>
      </div>
    </div>
  );
}
