"use client";

import { useState, useEffect, useMemo } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import Menu from "./Menu";
import GameOver from "./GameOver";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";

const Game = ({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: number;
}) => {
  // will refetch songs every 5 mins
  const { data: songsArr, isLoading, error } = usePlaylist(playlistId);
  const [score, setScore] = useState<number | null>(null);
  const [chosenSong, setChosenSong] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  // timer doesn't change once it's set, unlike duration. This is for updating db
  const [timer, setTimer] = useState(10);
  const [showMenu, setShowMenu] = useState(true);
  const [showHints, setShowHints] = useState(false);
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
          setTimer={setTimer}
          setScore={setScore}
          setShowMenu={setShowMenu}
          gameReady={!(isLoading || !correct || !songsArr)}
          showHints={showHints}
          playlistId={playlistId}
          setShowHints={setShowHints}
          userId={userId}
          timer={timer}
        />
      </div>
    );
  }
  if (isLoading || !correct || !songsArr) {
    return <>Spinner placeholder.</>;
  }
  if (error) {
    return <>error fetching playlist {playlistId}</>;
  }
  // score is not null and duration is 0, player just lost
  if (score !== null && !duration) {
    return (
      <GameOver
        score={score}
        setShowMenu={setShowMenu}
        playlistId={playlistId}
        timer={timer}
        userId={userId}
        showHints={showHints}
      />
    );
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
            showHints={showHints}
          />
        </>
      )}
    </div>
  );
};

export default Game;
