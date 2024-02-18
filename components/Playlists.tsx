'use client';
import useUserPlaylists from "@/hooks/useUserPlaylists";
import PlaylistSection from "@/components/PlaylistSection";

export default function Playlists({userId, name} : {userId: string; name: string}) {

  return (
    <div className="w-full">
      <PlaylistSection usePlaylistHook={useUserPlaylists} hookParams={[userId]} />
    </div>
  );
};

