"use server";
import refreshAccessToken from "./refreshAccessToken";

async function fetchCategoryName(categoryId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoryId}`,
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
  return data.name;
}

export default async function getCategoryName(categoryId: string) {
  const accessToken = process.env.ACCESS_TOKEN as string;
  try {
    return await fetchCategoryName(categoryId, accessToken);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("The access token expired")
    ) {
      while (true) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          try {
            return await fetchCategoryName(categoryId, newAccessToken);
          } catch (err) {
            console.log("NEW ACCESS TOKEN FAILED: ", err);
          }
        }
      }
    } else {
      console.log("An error unrelated to access token occurred: ", error);
    }
    throw error;
  }
}
