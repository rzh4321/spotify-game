import TopScoresTable from "./TopScoresTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LeaderboardProps = {
  playlistId: string | undefined;
  userId: number;
  name: string | undefined;
};

export default function Leaderboard({
  playlistId,
  userId,
  name,
}: LeaderboardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"blue"}>
          <BarChart2 />
          Leaderboards
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center max-w-[1100px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Top Scores for {name ?? ""}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-between gap-10 min-h-[315px]">
          <TopScoresTable playlistId={playlistId} timer={5} userId={userId} />
          <TopScoresTable playlistId={playlistId} timer={10} userId={userId} />
          <TopScoresTable playlistId={playlistId} timer={15} userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
