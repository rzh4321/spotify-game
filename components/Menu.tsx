"use client";

import type { PlaylistInfo, Song } from "@/types";
import TopScoresTable from "./TopScoresTable";
import MenuOptions from "./MenuOptions";
import Image from "next/image";
type MenuProps = {
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHints: React.Dispatch<React.SetStateAction<boolean>>;
  gameReady: boolean;
  userId: number;
  showHints: boolean;
  timer: number;
  playlistInfo: PlaylistInfo | undefined;
  songs: Song[] | undefined;
  getHighScore: () => Promise<void>;
};

export default function Menu({
  setDuration,
  setTimer,
  setScore,
  setShowMenu,
  setShowHints,
  gameReady,
  playlistInfo,
  songs,
  userId,
  showHints,
  timer,
  getHighScore,
}: MenuProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 items-center">
        <div className="flex justify-between gap-10 min-h-[315px]">
          <TopScoresTable
            playlistId={playlistInfo?.playlistId}
            gameTimer={timer}
            timer={5}
            userId={userId}
            showHints={showHints}
          />
          <TopScoresTable
            playlistId={playlistInfo?.playlistId}
            gameTimer={timer}
            timer={10}
            userId={userId}
            showHints={showHints}
          />
          <TopScoresTable
            playlistId={playlistInfo?.playlistId}
            gameTimer={timer}
            timer={15}
            userId={userId}
            showHints={showHints}
          />
        </div>

      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div><Image alt="playlist-image" src={playlistInfo?.image as string} width={200} height={200} /></div>
            <div className="space-y-3">
              <div className="tracking-tighter">PLAYLIST</div>
              <div className="text-3xl font-bold">{playlistInfo?.name}</div>
              <div className="text-xs">{playlistInfo?.description}</div>
              <div className="text-xs">{playlistInfo?.owner} - {playlistInfo?.count} Songs</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>leaderboard button</div>
            <MenuOptions
              setDuration={setDuration}
              setTimer={setTimer}
              setScore={setScore}
              setShowMenu={setShowMenu}
              setShowHints={setShowHints}
              gameReady={gameReady}
              getHighScore={getHighScore}
              playlistInfo={playlistInfo}
            />
          </div>
        </div>
        <div>playlist1</div>
        <div>playlist2</div>
      </div>
    </div>
  );
}
