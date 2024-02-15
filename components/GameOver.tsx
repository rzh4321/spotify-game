import { Button } from "./ui/button";
import Link from "next/link";

type GameOverProps = {
  score: number;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GameOver({ score, setShowMenu }: GameOverProps) {
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
