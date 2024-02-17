"use server";

export default async function getPreviewUrl(trackId: string) {
  const audioPreviewRegex =
    /"audioPreview":\{"url":"(https:\/\/p\.scdn\.co\/mp3-preview\/[a-zA-Z0-9-]+)"\}/;
  const res = await fetch(
    `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`,
  );
  const text = await res.text();
  const matches = audioPreviewRegex.exec(text);

  if (matches && matches[1]) {
    // The second element in the array will be the capture group, the URL in this case
    const audioPreviewUrl = matches[1];
    return audioPreviewUrl;
  } else {
    return null;
  }
}
