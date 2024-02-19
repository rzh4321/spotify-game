import type {
  SimplifiedPlaylistObject,
  SimplifiedCategoryObject,
} from "@/types";
import Image from "next/image";
import Link from "next/link";

type ContentCardProps = {
  infoObject: SimplifiedPlaylistObject | SimplifiedCategoryObject;
  type: "playlist" | "category";
  displayNames: boolean;
};

const ContentCard = ({ infoObject, type, displayNames }: ContentCardProps) => {
  let url;
  if (type === "playlist") {
    const playlistInfo = infoObject as SimplifiedPlaylistObject;
    url = `/play/${playlistInfo.playlistId}`;
  } else {
    const categoryInfo = infoObject as SimplifiedCategoryObject;
    url = `/categories/${categoryInfo.categoryId}`;
  }
  return (
    <div
      className="flex relative items-center justify-center border border-gray-300
      w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 
      lg:w-72 lg:h-72 xl:w-96 xl:h-96 cursor-pointer transition-all duration-300 ease-out transform hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white ho bg-gray-700"
    >
      <Link href={url}>
        <Image
          alt={infoObject.name}
          src={infoObject.image === null ? "" : infoObject.image}
          height={400}
          width={400}
        />
        {displayNames && (
          <div
            className={`absolute shadow-lg m-auto inset-x-0 text-center ${type === "playlist" ? "top-[45%]" : "bottom-[10px]"} xl:text-3xl lg:text-2xl md:text-xl font-semibold`}
          >
            {infoObject.name}
          </div>
        )}
      </Link>
    </div>
  );
};

export default ContentCard;
