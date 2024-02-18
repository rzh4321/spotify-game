import Playlists from "@/components/Playlists";

import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string }).id;
  const name = (session?.user as { name: string }).name;

  return <Playlists userId={userId} name={name} />;
};

export default Home;
