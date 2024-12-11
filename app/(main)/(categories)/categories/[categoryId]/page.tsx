import Playlists from "@/components/Playlists";
import { FaSadCry } from "react-icons/fa";

import getCategoryName from "@/actions/getCategoryName";

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryName = await getCategoryName(params.categoryId);
  console.log("category name is ", categoryName);

  return (
    <div className="flex items-center justify-center gap-3 h-[75vh]">
      {`Spotify's Web API has deprecated this endpoint`}
      <FaSadCry />
    </div>
    // <Playlists categoryId={params.categoryId} categoryName={categoryName} />
  );
}
