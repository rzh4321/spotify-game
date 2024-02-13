"use client";

import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import usePlaylists from "@/hooks/usePlaylists";
import Test from "@/components/Test";

const Home: NextPage = () => {
  const session = useSession();
  const userId = session?.status === 'authenticated' ? session.data.user?.id : null;
  const { data, loading, error, refetch } = usePlaylists(userId);
  console.log("session is ", session);

  console.log('in page.tsx. id is ', userId);

  if (loading || session?.status !== 'authenticated') {
    return <>Spinner placeholder.</>; 
  }
  if (error) {
    return <>error fetching user playlists</>
  }
  const playlists = data.items.map(playlist => ({ "name": playlist.name, "playlistId": playlist.id }));
  const playlistId = playlists[4].playlistId;

  return (
    <div className={styles.container}>
      {JSON.stringify(playlists)}
      <br />
      <Test playlistId={playlistId} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome,{" "}
          {session.status === "authenticated"
            ? session.data.user?.name || "friend"
            : "stranger"}
          !
        </h1>
        <p>
          {session.status === "authenticated" ? (
            <button
              className={styles.button}
              type="button"
              onClick={() => signOut()}
            >
              Sign out {session.data.user?.email}
            </button>
          ) : (
            <button
              className={styles.button}
              type="button"
              onClick={() => signIn("spotify")}
              disabled={session.status === "loading"}
            >
              Sign in with Spotify
            </button>
          )}
        </p>
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
