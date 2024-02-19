import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import type { Playlist } from "@/types";

async function fetchCategoryPlaylists(
  categoryId: string,
  accessToken: string,
  pageNumber: number,
) {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?offset=${pageNumber * 6}&limit=6`,
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
  // map each playlist data to a more readable object that has name, playlistId, and image
  const playlists = data.playlists.items.map((playlist: Playlist) => ({
    name: playlist.name,
    playlistId: playlist.id,
    image: playlist.images[0]?.url ?? null,
  }));
  return playlists;
}

export default function useCategoryPlaylists(
  pageNumber: number,
  categoryId: string,
) {
  const queryKey = ["categoryPlaylists", categoryId, pageNumber];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        let accessToken = await getAccessToken();
        return await fetchCategoryPlaylists(
          categoryId,
          accessToken,
          pageNumber,
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("Refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              return await fetchCategoryPlaylists(
                categoryId,
                newAccessToken,
                pageNumber,
              );
            } catch (err) {
              console.log("NEW ACCESS TOKEN FAILED: ", err);
            }
          }
        } else {
          console.log("An error unrelated to access token occurred: ", error);
        }
        throw error;
      }
    },
    enabled: !!categoryId, // query wont execute until userId exists
    refetchInterval: 1000 * 60 * 60, // refetch playlists every hour
    refetchIntervalInBackground: true,
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, error, refetch };
}
