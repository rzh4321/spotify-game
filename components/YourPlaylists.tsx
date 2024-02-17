"use client";
import { RefreshCw } from "lucide-react";
import usePlaylists from "@/hooks/usePlaylists";
import type { SimplifiedPlaylistObject } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PlaylistCard from "./PlaylistCard";

export default function YourPlaylists({ userId }: { userId: string }) {
  const { data : playlists, isLoading, error, refetch } = usePlaylists(userId);
  const { toast } = useToast();
  const [refetching, setRefetching] = useState(false);

  if (isLoading) {
    return <>Spinner placeholder.</>;
  }
  if (error) {
    return <>error fetching user playlists</>;
  }
  const playlistCards = playlists.map((playlist: SimplifiedPlaylistObject) => (
    <PlaylistCard key={playlist.playlistId} playlist={playlist} />
  ));

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
      <div className="flex flex-wrap lg:justify-between gap-10">
        {playlistCards}
      </div>
    </div>
  );
}
