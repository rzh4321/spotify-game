import Game from "@/components/Game";

export default function Page({ params }: { params: { playlistId: string } }) {
  const playlistId = params.playlistId;
  return <Game playlistId={playlistId} />;
}
