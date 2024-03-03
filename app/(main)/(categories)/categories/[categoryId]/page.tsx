import Playlists from "@/components/Playlists";

import getCategoryName from "@/actions/getCategoryName";

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryName = await getCategoryName(params.categoryId);
  console.log("category name is ", categoryName);

  return (
    <Playlists categoryId={params.categoryId} categoryName={categoryName} />
  );
}
