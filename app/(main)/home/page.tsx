"use client";

import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";

import usePlaylists from "@/hooks/usePlaylists";
import Test from "@/components/Test";
import Game from "@/components/Game";
import getPreviewUrl from "@/actions/getPreviewUrl";
import { useEffect } from "react";

const Home: NextPage = () => {
  const session = useSession();
  const userId =
    session?.status === "authenticated" ? session.data.user?.id : null;
  const { data, isLoading, error, refetch } = usePlaylists(userId);

  if (isLoading || session?.status !== "authenticated") {
    return <>Spinner placeholder.</>;
  }
  if (error) {
    return <>error fetching user playlists</>;
  }
  const playlists = data.items.map((playlist) => ({
    name: playlist.name,
    playlistId: playlist.id,
  }));
  const playlistId = playlists[4].playlistId;

  return (
    <div className="">
      {JSON.stringify(playlists)}
      <br />
      <br />
      <br />
      <br />

      {/* <Test playlistId={playlistId} /> */}
      <Game playlistId={playlistId} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome,{" "}
          {session.status === "authenticated"
            ? session.data.user?.name || "friend"
            : "stranger"}
          !
        </h1>
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
