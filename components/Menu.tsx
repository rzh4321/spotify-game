"use client";

import TopScoresTable from "./TopScoresTable";
import MenuOptions from "./MenuOptions";
type MenuProps = {
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHints: React.Dispatch<React.SetStateAction<boolean>>;
  gameReady: boolean;
  playlistId: string;
  userId: number;
  showHints: boolean;
  timer: number;
};

export default function Menu({
  setDuration,
  setTimer,
  setScore,
  setShowMenu,
  setShowHints,
  gameReady,
  playlistId,
  userId,
  showHints,
  timer,
}: MenuProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex justify-between gap-10 min-h-[315px]">
        <TopScoresTable
          playlistId={playlistId}
          gameTimer={timer}
          timer={5}
          userId={userId}
          showHints={showHints}
        />
        <TopScoresTable
          playlistId={playlistId}
          gameTimer={timer}
          timer={10}
          userId={userId}
          showHints={showHints}
        />
        <TopScoresTable
          playlistId={playlistId}
          gameTimer={timer}
          timer={15}
          userId={userId}
          showHints={showHints}
        />
      </div>

      <MenuOptions
        setDuration={setDuration}
        setTimer={setTimer}
        setScore={setScore}
        setShowMenu={setShowMenu}
        setShowHints={setShowHints}
        gameReady={gameReady}
      />
    </div>
  );
}
