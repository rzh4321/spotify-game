import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";
import type { Category } from "@/types";

async function fetchCategories(accessToken: string, pageNumber: number) {
  const response = await fetch(
    `
    https://api.spotify.com/v1/browse/categories?offset=${pageNumber * 9}&limit=9`,
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
  const categories = data.categories.items.map((category: Category) => ({
    name: category.name,
    categoryId: category.id,
    image: category.icons[0]?.url ?? null,
  }));
  return categories;
}

export default function useCategories(pageNumber: number) {
  const queryKey = ["categories", pageNumber];

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        let accessToken = await getAccessToken();
        return await fetchCategories(accessToken, pageNumber);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("Refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              return await fetchCategories(newAccessToken, pageNumber);
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
    refetchInterval: 1000 * 60 * 1440, // refetch categories every day
    refetchIntervalInBackground: true,
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, error, refetch };
}
