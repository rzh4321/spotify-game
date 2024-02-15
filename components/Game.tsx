"use client";

import { useState, useEffect, useMemo } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import Menu from "./Menu";
import GameOver from "./GameOver";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";

const Game = ({ playlistId }: { playlistId: string }) => {
  // will refetch songs every 5 mins
  const { data: songsArr, isLoading, error } = usePlaylist(playlistId);
  // State to hold the current round, score, and whether the game is over
  //   const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [chosenSong, setChosenSong] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(true);

  // memoize correct song to prevent Choices component from re-choosing a new set
  // of incorrect choices on initial mount
  const correct = useMemo(() => {
    return chosenSong;
  }, [chosenSong]);

  // Function to start a new round
  const getSong = () => {
    if (!songsArr) {
      return;
    }
    // Randomly select a new song that didn't just play and has a preview url
    const newSongsArr = songsArr.filter(
      (song) => song.id !== chosenSong?.id && song.url,
    );
    const newSong = newSongsArr[Math.floor(Math.random() * newSongsArr.length)];
    setChosenSong(newSong);
  };

  // Function to handle user's choice
  const handleChoice = (selectedName: string) => {
    if (!chosenSong) return;
    if (selectedName === chosenSong.name) {
      setScore((prevScore) => (prevScore as number) + 1);
    } else {
      setDuration(0); // End the game if the answer is wrong
    }
  };

  useEffect(() => {
    // first condition means game is ongoing. Second condition means menu is displayed
    if ((score !== null && duration && !isLoading) || showMenu) {
      getSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, duration, isLoading]);

  if (showMenu) {
    return (
      <div className="flex justify-center items-center">
        <Menu
          setDuration={setDuration}
          setScore={setScore}
          setShowMenu={setShowMenu}
          gameReady={!(isLoading || !correct || !songsArr)}
        />
      </div>
    );
  }
  if (isLoading || !correct || !songsArr) {
    console.log(
      "isloading is ",
      isLoading,
      " !correct is ",
      !correct,
      " !songsArr is ",
      !songsArr,
    );
    return <>Spinner placeholder.</>;
  }
  if (error) {
    return <>error fetching playlist {playlistId}</>;
  }
  // score is not null and duration is 0, player just lost
  if (score !== null && !duration) {
    return <GameOver score={score} setShowMenu={setShowMenu} />;
  }

  // score is not null and theres a duration, game is ongoing
  console.log("a song has been chosen, its ", correct.name);
  return (
    <div>
      <h2>Score: {score}</h2>
      {chosenSong && (
        <>
          <AudioPlayer url={chosenSong.url} duration={duration} />
          <Timer
            key={score} // need the key to remount every round
            duration={duration}
            onTimerEnd={() => setDuration(0)}
          />
          <Choices
            songs={songsArr}
            correctSong={correct}
            onChoiceSelected={handleChoice}
          />
        </>
      )}
    </div>
  );
};

export default Game;
