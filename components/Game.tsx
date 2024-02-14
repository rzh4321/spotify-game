"use client";

import { useState, useEffect, useMemo } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import Menu from "./Menu";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";

const Game = ({ playlistId }: { playlistId: string }) => {
  const { data: songsArr, isLoading, error, refetch } = usePlaylist(playlistId);
  // State to hold the current round, score, and whether the game is over
  //   const [currentRound, setCurrentRound] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [chosenSong, setChosenSong] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0); // Replace with user input for duration

  // memoize correct song to prevent Choices component from re-choosing a new set
  // of incorrect choices on initial mount
  const correct = useMemo(() => {
    return chosenSong;
  }, [chosenSong]);

  // Function to start a new round
  const startRound = () => {
    if (!songsArr) {
      return;
    }
    // Randomly select a new song that hasn't been played in the last round
    console.log('the song that just played was ', chosenSong?.name);
    const newSongsArr = songsArr.filter((song) => song.id !== chosenSong?.id);
    console.log('newSongsArr shouldnt have ', chosenSong?.name, '. it is ', newSongsArr);
    const newSong = newSongsArr[Math.floor(Math.random() * newSongsArr.length)];
    setChosenSong(newSong);
    // setCurrentRound((prevRound) => prevRound + 1);
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
    console.log('useEffect running')
    if (score !== null && duration && !isLoading) {
      startRound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, duration, isLoading]);

  // score is null and no duration, player hasnt started yet
  if (score === null && !duration) {
    return (
      <div className="flex justify-center items-center">
        <Menu setDuration={setDuration} setScore={setScore} />
      </div>
    );
  }
  if (error) {
    return <>error fetching playlist {playlistId}</>;
  }
  if (isLoading || !correct || !songsArr) {
    return <>Spinner placeholder.</>;
  }
  // score is not null and duration is 0, player just lost
  if (score !== null && !duration) {
    return <div>Game Over! Your score was: {score}</div>;
    // if play again, set score to null
  }

  // score is not null and theres a duration, game is ongoing

  return (
    <div>
      {/* <h1>Game Round: {currentRound}</h1> */}
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
