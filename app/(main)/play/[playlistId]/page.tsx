import Game from "@/components/Game";
import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";

export default async function Page({ params }: { params: { playlistId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { userId: string }).userId;
  const playlistId = params.playlistId;
  return <Game playlistId={playlistId} userId={userId} />;
}
