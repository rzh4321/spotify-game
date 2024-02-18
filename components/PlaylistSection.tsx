"use client";
import { RefreshCw, StepBack, StepForward } from "lucide-react";
import type { SimplifiedPlaylistObject } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PlaylistCard from "./PlaylistCard";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type usePlaylistReturnTypes = {
  data: any;
  isLoading: boolean;
  error: Error | null;
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

type UsePlaylistHook<T extends any[]> = (pageNumber : number, ...args: T) => usePlaylistReturnTypes;

type PlaylistSectionProps<T extends any[]> = {
  usePlaylistHook: UsePlaylistHook<T>;
  hookParams: T;
}

export default function PlaylistSection({usePlaylistHook, hookParams} : PlaylistSectionProps<any[]>) {
  const [pageNumber, setPageNumber] = useState(0);
  const { data : playlists, isLoading, error, refetch } = usePlaylistHook(pageNumber, ...hookParams);
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
      <div className="flex justify-center items-center gap-4">
        <StepBack className="cursor-pointer" onClick={() => setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 0))} />
        <span>{pageNumber+1}</span>
        <StepForward className="cursor-pointer" onClick={() => setPageNumber((prevPageNumber) => prevPageNumber + 1)} />

      </div>
    </div>
  );
}
