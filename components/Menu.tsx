"use client";

import type { PlaylistInfo, Song } from "@/types";
import MenuOptions from "./MenuOptions";
import Leaderboard from "./Leaderboard";
import SongCard from "./SongCard";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

type MenuProps = {
  gameReady: boolean;
  playlistInfo: PlaylistInfo | undefined;
  songs: Song[] | undefined;
  userId: number;
  getHighScore: () => Promise<void>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => Promise<void>;
};

export default function Menu({
  gameReady,
  playlistInfo,
  songs,
  userId,
  getHighScore,
  setShowMenu,
  refetch,
}: MenuProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  const showMoreItems = () => {
    setVisibleCount((prevVisibleCount) => prevVisibleCount + 10);
  };

  // Get the songs to display
  const itemsToDisplay = songs?.slice(0, visibleCount);

  if (!gameReady) {
    return (
      <div className="flex justify-center items-center mt-[25%]">
        <div className="text-3xl font-sans tracking-wide text-center">
          Loading Playlist
          <span className="dots overflow-hidden align-baseline"></span>
          <br></br>
          <span className="text-xs">
            (may take some time if playlist is large)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full z-[1]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center mr-4">
            <div className="hidden sm:block">
              <Image
                alt="playlist-image"
                src={playlistInfo?.image as string}
                width={200}
                height={200}
              />
            </div>
            <div className="space-y-3">
              <div className="tracking-tighter">PLAYLIST</div>
              <div className="sm:text-3xl text-xl font-bold">
                {playlistInfo?.name}
              </div>
              <div className="text-xs">{playlistInfo?.description}</div>
              <div className="text-xs">
                {playlistInfo?.owner} - {playlistInfo?.count} Songs
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Leaderboard
              playlistId={playlistInfo?.playlistId}
              userId={userId}
              name={playlistInfo?.name}
            />
            <MenuOptions
              gameReady={gameReady}
              getHighScore={getHighScore}
              playlistInfo={playlistInfo}
              setShowMenu={setShowMenu}
            />
          </div>
        </div>
        <Button
          className="flex gap-1 w-fit"
          variant={"spotify"}
          onClick={refetch}
        >
          <RefreshCcw className="w-[20px]" />
          <span className="text-xs">Refresh</span>
        </Button>
        {itemsToDisplay?.map((song: Song, ind) => (
          <SongCard key={song.id} songObj={song} num={ind + 1} />
        ))}
        {songs && visibleCount < songs.length && (
          <Button
            onClick={showMoreItems}
            className="self-center"
            variant={"blue"}
          >
            Show More
          </Button>
        )}
      </div>
    </div>
  );
}
