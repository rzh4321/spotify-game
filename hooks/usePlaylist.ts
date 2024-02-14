import { useQuery } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import getPreviewUrl from "@/actions/getPreviewUrl";
import type { Track, Song } from "@/types";

async function fetchPlaylistData(
  playlistId: string,
  accessToken: string,
): Promise<Song[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?limit=10000`,
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
  const promises = data.tracks.items.map(async (track: Track) => {
    let previewUrl: string | null = track.track.preview_url;
    if (!previewUrl) {
      previewUrl = await getPreviewUrl(track.track.id);
    }
    return {
      id: track.track.id,
      name: track.track.name,
      url: previewUrl,
    };
  });

  // Wait for all promises to resolve
  return Promise.all(promises);
}

export default function usePlaylist(playlistId: string) {
  const queryKey = ["playlist", playlistId];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        let accessToken = await getAccessToken();
        return await fetchPlaylistData(playlistId, accessToken);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            return fetchPlaylistData(playlistId, newAccessToken);
          }
        }
        throw error;
      }
    },
  });

  return { data, isLoading, error, refetch };
}
