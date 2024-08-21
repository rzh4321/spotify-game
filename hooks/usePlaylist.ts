import { useQuery } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import getPreviewUrl from "@/actions/getPreviewUrl";
import type { Track, Song, PlaylistInfo } from "@/types";
import {
  cachePlaylistData,
  getCachedPlaylistData,
} from "@/actions/redisActions";
import { useState, useRef, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";

async function fetchNextSongs(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data: " + (await response.text()));
  }
  const data = await response.json();
  // map each song to a more readable object that includes its previewUrl. If null, fetch it
  const promises = data.items.map(async (track: Track) => {
    let previewUrl: string | null = track.track.preview_url;
    if (!previewUrl) {
      previewUrl = await getPreviewUrl(track.track.id);
    }
    return {
      id: track.track.id,
      name: track.track.name,
      url: previewUrl,
      album: track.track.album.name,
      date_added: track.added_at,
      artists: track.track.artists.map((artist) => artist.name),
      duration: track.track.duration_ms,
      popularity: track.track.popularity,
      image: track.track.album.images[0].url,
    } as Song;
  });
  return { nextPromises: promises, url: data.next };
}

async function fetchPlaylistData(
  playlistId: string,
  accessToken: string,
): Promise<{ songsArr: Song[]; playlistInfo: PlaylistInfo }> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data: " + (await response.text()));
  }

  const data = await response.json();

  const playlistInfo = {
    name: data.name,
    playlistId: data.id,
    image: data.images[0]?.url ?? null,
    description: data.description,
    count: data.tracks.total,
    owner: data.owner.display_name,
  };

  // map each song to a more readable object that includes its previewUrl. If null, fetch it
  let promises = data.tracks.items.map(async (track: Track) => {
    if (track.track) {
      let previewUrl: string | null = track.track.preview_url;
      if (!previewUrl) {
        previewUrl = await getPreviewUrl(track.track.id);
      }
      return {
        id: track.track.id,
        name: track.track.name,
        url: previewUrl,
        album: track.track.album.name,
        date_added: track.added_at,
        artists: track.track.artists.map((artist) => artist.name),
        duration: track.track.duration_ms,
        popularity: track.track.popularity,
        image: track.track.album.images[0].url,
      } as Song;
    }
  });
  let nextUrl = data.tracks.next;
  while (nextUrl) {
    let { nextPromises, url } = await fetchNextSongs(nextUrl, accessToken);
    promises = [...promises, ...nextPromises];
    nextUrl = url;
  }

  // Wait for all promises to resolve
  const songs = await Promise.all(promises);
  return { songsArr: songs, playlistInfo };
}

export default function usePlaylist(playlistId: string) {
  const queryKey = useMemo<QueryKey>(
    () => ["playlist", playlistId],
    [playlistId],
  );
  const queryClient = useQueryClient();
  const bypassCacheRef = useRef(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!bypassCacheRef.current) {
        console.log("CHECKING CACHE...");
        const cachedData = await getCachedPlaylistData(playlistId);
        if (cachedData) {
          console.log("CACHE HIT");
          return cachedData;
        }
      } else {
        console.log("BYPASSING CACHE CHECK");
      }

      try {
        let accessToken = await getAccessToken();
        const fetchedData = await fetchPlaylistData(playlistId, accessToken);
        await cachePlaylistData(playlistId, fetchedData);
        return fetchedData;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              const fetchedData = await fetchPlaylistData(
                playlistId,
                newAccessToken,
              );
              await cachePlaylistData(playlistId, fetchedData);
              return fetchedData;
            } catch (err) {
              console.log(
                "NEW ACCESS TOKEN FAILED OR ANOTHER ERROR OCCURRED: ",
                err,
              );
              throw err;
            } finally {
              bypassCacheRef.current = false; // Reset bypass flag after query execution
            }
          }
        }
        throw error;
      } finally {
        bypassCacheRef.current = false; // Reset bypass flag after query execution
      }
    },
    refetchInterval: 1000 * 60 * 60, // refetch songs every hour
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });

  const refetchWithBypassCache = useCallback(async () => {
    setIsRefetching(true);
    bypassCacheRef.current = true;
    try {
      await queryClient.invalidateQueries({ queryKey });
      await refetch();
    } finally {
      setIsRefetching(false);
    }
  }, [queryClient, queryKey, refetch]);

  const isLoading = isFetching || isRefetching;
  return { data, isLoading, error, refetch: refetchWithBypassCache };
}
