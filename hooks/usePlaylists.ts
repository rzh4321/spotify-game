import { useQuery } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import type { Playlist } from "@/types";

async function fetchUserPlaylists(userId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`,
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
  const playlists = data.items.map((playlist: Playlist) => ({
    name: playlist.name,
    playlistId: playlist.id,
    image: playlist.images[0]?.url ?? null,
  }));
  return playlists;
}

export default function usePlaylists(userId: string) {
  const queryKey = ["userPlaylists", userId];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        let accessToken = await getAccessToken();
        return await fetchUserPlaylists(userId, accessToken);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("Refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              return fetchUserPlaylists(userId, newAccessToken);

            }
            catch(err) {
              console.log('NEW ACCESS TOKEN FAILED: ', err)
            }
          }
        }
        else {
          console.log("An error unrelated to access token occurred: ", error);
        }
        throw error;
      }
    },
    enabled: !!userId, // query wont execute until userId exists
    refetchInterval: 1000 * 60 * 60, // refetch playlists every hour
    refetchIntervalInBackground: true,
  });

  return { data, isLoading, error, refetch };
}
