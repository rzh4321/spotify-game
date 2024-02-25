import Playlists from "@/components/Playlists";

import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import getSpotifyUserId from "@/actions/getSpotifyUserId";

const Home = async () => {
  const session = await getServerSession(authOptions);
  // const userId = (session?.user as { id: string }).id;
  const username = (session?.user as { username: string }).username;
  const userId = await getSpotifyUserId(username);
  console.log("SESSION IS ", session);
  return <Playlists userId={userId} />;
};

export default Home;
