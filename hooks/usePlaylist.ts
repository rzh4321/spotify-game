import { useQuery } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import getPreviewUrl from "@/actions/getPreviewUrl";
import type { Track, Song, Playlist, PlaylistInfo } from "@/types";

async function fetchPlaylistData(
  playlistId: string,
  accessToken: string,
): Promise<{songsArr: Song[]; playlistInfo : PlaylistInfo}> {
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
  
    const playlistInfo = {
      name: data.name,
      playlistId: data.id,
      image: data.images[0]?.url ?? null,
      description: data.description,
      count: data.tracks.total,
      owner: data.owner.display_name,
    };

  // map each song to a more readable object that includes its previewUrl. If null, fetch it
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
  const songs = await Promise.all(promises);
  return {songsArr: songs, playlistInfo};
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
            try {
              return await fetchPlaylistData(playlistId, newAccessToken);
            } catch (err) {
              console.log(
                "NEW ACCESS TOKEN FAILED OR ANOTHER ERROR OCCURRED: ",
                err,
              );
              throw err;
            }
          }
        }
        throw error;
      }
    },
    refetchInterval: 1000 * 60 * 5, // refetch songs every 5 mins
    refetchIntervalInBackground: true,
  });

  return { data, isLoading, error, refetch };
}
