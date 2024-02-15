import styles from "../../../styles/Home.module.css";

import { getServerSession } from "next-auth";
import authOptions from "@/authOptions";
import YourPlaylists from "@/components/YourPlaylists";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string }).id;

  return (
    <div className="w-full">
      <YourPlaylists userId={userId} />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome, {session?.user?.name}!</h1>
      </main>
    </div>
  );
};

export default Home;
