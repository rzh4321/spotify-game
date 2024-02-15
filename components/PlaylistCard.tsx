import type { SimplifiedPlaylistObject } from "@/types";
import Image from "next/image";
import Link from "next/link";

const PlaylistCard = ({ playlist }: { playlist: SimplifiedPlaylistObject }) => {
  // const router = useRouter();
  return (
    <div
      className="flex items-center justify-center border border-gray-300
      w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 
      lg:w-72 lg:h-72 xl:w-96 xl:h-96 cursor-pointer transition-transform duration-300 ease-out transform hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white bg-gray-700"
    >
      <Link href={`/play/${playlist.playlistId}`}>
        <Image
          alt={playlist.name}
          src={playlist.image ? playlist.image : ""}
          height={400}
          width={400}
        />
      </Link>
    </div>
  );
};

export default PlaylistCard;
