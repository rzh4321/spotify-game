"use client";
import { RefreshCw, StepBack, StepForward, Loader } from "lucide-react";
import type { SimplifiedPlaylistObject, usePlaylistReturnTypes } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ContentCard from "./ContentCard";
import ErrorMessage from "./ErrorMessage";

// all usePlaylist hooks have pageNumber param. We dont know the rest of the args so we use T extends any[]
type UsePlaylistHook<T extends any[]> = (
  pageNumber: number,
  ...args: T
) => usePlaylistReturnTypes;

type PlaylistSectionProps<T extends any[]> = {
  usePlaylistHook: UsePlaylistHook<T>;
  hookParams: T;
  label: string;
};

// accepts a usePlaylist hook and all of its params in an array
export default function PlaylistSection({
  usePlaylistHook,
  hookParams,
  label,
}: PlaylistSectionProps<any[]>) {
  const [pageNumber, setPageNumber] = useState(0);
  const { data, isLoading, error, refetch } = usePlaylistHook(
    pageNumber,
    ...hookParams,
  );
  const { toast } = useToast();
  const [refetching, setRefetching] = useState(false);

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold">{label}</h1>
        <RefreshCw
          size={40}
          onClick={async () => {
            if (refetching || isLoading) return;
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
        {!isLoading &&
          !error &&
          (data?.playlists && data?.playlists.length > 0 ? (
            data.playlists.map((playlist: SimplifiedPlaylistObject) => (
              <ContentCard
                key={playlist.playlistId}
                infoObject={playlist}
                type="playlist"
                displayNames={label !== "Charts"}
              />
            ))
          ) : (
            <div className="text-red-700">No playlists found</div>
          ))}
        {isLoading && (
          <div className="w-full">
            <Loader className="animate-spin m-auto" />
          </div>
        )}
        {error && (
          <ErrorMessage message="Error fetching playlists. Is your user ID correct?" type="link" />
        )}
      </div>
      <div className="flex justify-center items-center gap-4 mb-10">
        <StepBack
          className="cursor-pointer"
          onClick={() =>
            !isLoading &&
            !error &&
            setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 0))
          }
        />
        <span>{pageNumber + 1}</span>
        <StepForward
          className="cursor-pointer"
          onClick={() =>
            !isLoading &&
            !error &&
            pageNumber + 1 < Math.ceil(data?.count / 6) &&
            setPageNumber((prevPageNumber) => prevPageNumber + 1)
          }
        />
      </div>
    </div>
  );
}
