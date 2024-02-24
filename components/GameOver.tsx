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
};

export default function GameOver({ score, setShowMenu, playlistId, timer, userId, showHints }: GameOverProps) {
  useEffect(() => {
    async function updateDatabase() {
      await UpdatePlaylistAndCreatePlay(userId, playlistId, showHints, timer, score);
    }
    updateDatabase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // make sure its only run once to avoid updating db multiple times
  return (
    <div>
      Game Over! Your score was: {score}
      <Button onClick={() => setShowMenu(true)}>Play again</Button>
      <Link href="/home">
        <Button>Back to playlists</Button>
      </Link>
    </div>
  );
}
