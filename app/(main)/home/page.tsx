import Image from "next/image";
import styles from "../../../styles/Home.module.css";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import YourPlaylists from "@/components/YourPlaylists";
import Game from "@/components/Game";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string }).id;

  return (
    <div className="">
      <YourPlaylists userId={userId} />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome, {session?.user?.name}!</h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
