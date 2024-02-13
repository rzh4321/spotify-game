"use server";

export default async function refreshAccessToken() {
  const authOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.REFRESH_TOKEN as any,
    }),
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions,
    );
    const data = await response.json();
    if (response.ok) {
      console.log("The access token has been refreshed successfully!");
      return data.access_token;
    } else {
      // Handle the error case
      console.error("Failed to refresh the access token.", data);
    }
  } catch (error) {
    console.error("Failed to refresh the access token.", error);
  }
}
