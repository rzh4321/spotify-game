import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import type { Playlist } from "@/types";

async function fetchFeaturedPlaylists(accessToken: string, pageNumber: number) {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/featured-playlists?offset=${pageNumber * 6}&limit=6`,
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
  // map each playlist data to a more readable object
  const playlists = data.playlists.items.map((playlist: Playlist) => ({
    name: playlist.name,
    playlistId: playlist.id,
    image: playlist.images[0]?.url ?? null,
  }));
  const count = data.playlists.total;
  return { playlists, count };
}

export default function useFeaturedPlaylists(pageNumber: number) {
  const queryKey = ["featuredPlaylists", pageNumber];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        let accessToken = await getAccessToken();
        return await fetchFeaturedPlaylists(accessToken, pageNumber);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("Refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              return await fetchFeaturedPlaylists(newAccessToken, pageNumber);
            } catch (err) {
              console.log(
                "NEW ACCESS TOKEN FAILED OR ANOTHER ERROR OCCURRED: ",
                err,
              );
              throw err;
            }
          }
        } else {
          console.log("An error unrelated to access token occurred: ", error);
        }
        throw error;
      }
    },
    refetchInterval: 1000 * 60 * 1440, // refetch playlists every day
    refetchIntervalInBackground: true,
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, error, refetch };
}
