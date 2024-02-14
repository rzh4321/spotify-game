"use client";
import { RefreshCw } from "lucide-react";
import usePlaylists from "@/hooks/usePlaylists";
import type { Playlist } from "@/types";
import { useState } from "react";
import Game from "./Game";
import { useToast } from "@/components/ui/use-toast";

export default function YourPlaylists({ userId }: { userId: string }) {
  const { data, isLoading, error, refetch } = usePlaylists(userId);
  const { toast } = useToast();
  const [refetching, setRefetching] = useState(false);

  if (isLoading) {
    return <>Spinner placeholder.</>;
  }
  if (error) {
    return <>error fetching user playlists</>;
  }
  const playlists = data.items.map((playlist: Playlist) => ({
    name: playlist.name,
    playlistId: playlist.id,
    image: playlist.images[0]?.url ?? null,
  }));
  const playlistId = playlists[4].playlistId;

  return (
    <div className="flex flex-col w-full gap-8 px-5">
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold">Your Playlists</h1>
        <RefreshCw
          size={40}
          onClick={async () => {
            if (refetching) return;
            setRefetching(true);
            try {
              await refetch({ throwOnError: true });
            } catch (err: any) {
              toast({
                variant: "destructive",
                title: "Error refetching playlists",
                description: err?.message || "Unknown server error",
              });
            } finally {
              setRefetching(false);
            }
          }}
          className={`cursor-pointer ${refetching ? "animate-spin" : null}`}
        />
      </div>
      {JSON.stringify(playlists)}
      <br />
      <br />
      <br />
      <br />
      <Game playlistId={playlistId} />
    </div>
  );
}
