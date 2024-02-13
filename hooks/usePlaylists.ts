import { useState, useEffect, useCallback } from "react";
import getAccessToken from "@/actions/getAccessToken";
import refreshAccessToken from "@/actions/refreshAccessToken";

export default function usePlaylists(userId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getData = useCallback(
    async (accessToken?: string) => {
      setError(null);

      try {
        if (!accessToken) accessToken = await getAccessToken();
        const response = await fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
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
        setData(data);
      } catch (error: any) {
        console.error("An error occurred (access token expired?):", error);
        setError(error as Error);

        // If the token is invalid, try to refresh it once
        if (
          error instanceof Error &&
          error.message.includes("The access token expired")
        ) {
          console.log("refreshing access token");
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            await getData(newAccessToken);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!userId) {
      setData(null); // Clear any previous data
      return; // Exit if there is no user ID
    }
    getData();
  }, [userId, getData]);

  return { data, loading, error, refetch: getData };
}
