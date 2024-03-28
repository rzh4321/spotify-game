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
        <Button variant={"blue"} className="text-xs sm:text-base">
          <BarChart2 />
          <span className="hidden sm:block">Leaderboards</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-old-bg flex flex-col items-center justify-center overflow-auto max-h-screen max-w-[500px] lg:max-w-[1000px] mt-2">
        <div className="max-h-screen pt-5">
          <DialogHeader>
            <DialogTitle className="text-center">
              Top Scores for {name ?? ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row mt-2 justify-between gap-10">
            <TopScoresTable playlistId={playlistId} timer={5} userId={userId} />
            <TopScoresTable
              playlistId={playlistId}
              timer={10}
              userId={userId}
            />
            <TopScoresTable
              playlistId={playlistId}
              timer={15}
              userId={userId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
