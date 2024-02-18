"use client";
import useUserPlaylists from "@/hooks/useUserPlaylists";
import useFeaturedPlaylists from "@/hooks/useFeaturedPlaylists";
import PlaylistSection from "@/components/PlaylistSection";

export default function Playlists({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  return (
    <div className="w-full">
      <PlaylistSection
        usePlaylistHook={useUserPlaylists}
        hookParams={[userId]}
        label="Your Playlists"
      />
      <PlaylistSection
        usePlaylistHook={useFeaturedPlaylists}
        hookParams={[]}
        label="Featured Playlists"
      />
    </div>
  );
}
