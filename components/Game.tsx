"use client";

import { useState, useEffect, useMemo } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import Menu from "./Menu";
import GameOver from "./GameOver";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";
import ErrorMessage from "./ErrorMessage";
import getHighScore from "@/actions/getHighScore";

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
  const [highScore, setHighScore] = useState<null | number>(null);
  const [selectedSong, setSelectedSong] = useState<string>();

  // memoize correct song to prevent Choices component from re-choosing a new set
  // of incorrect choices on initial mount
  const correct = useMemo(() => {
    return chosenSong;
  }, [chosenSong]);

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
    setSelectedSong(selectedName);
    if (selectedName === chosenSong.name) {
      setScore((prevScore) => (prevScore as number) + 1);
      setDuration(timer);
    } else {
      setDuration(0); // End the game if the answer is wrong
    }
  };

  const getHighScoreAtGameStart = async () => {
    const score = await getHighScore(playlistId, timer, userId, showHints);
    console.log("score is ", score);
    setHighScore(score);
  };

  useEffect(() => {
    // first condition means game is ongoing. Second condition means menu is displayed. If either
    // is true, get a new song
    if ((score !== null && timer && !isLoading) || showMenu) {
      getSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, timer, isLoading]);

  if (showMenu) {
    return (
      <div className="flex flex-col gap-10 justify-center items-center">
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
          getHighScore={getHighScoreAtGameStart}
        />
        {error && (
          <ErrorMessage
            message={`Failed to fetch playlist: ${error.message}`}
          />
        )}
      </div>
    );
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
        correct={correct?.name as string}
        selected={selectedSong as string}
        beatHighScore={score > (highScore as number)}
      />
    );
  }

  // score is not null and theres a duration, game is ongoing
  console.log("a song has been chosen, its ", correct?.name);
  return (
    <div className="px-5 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-xs">High score: {highScore ?? "N/A"}</h3>
        <Timer
          key={score} // need the key to remount every round
          duration={duration}
          setDuration={setDuration}
        />
      </div>
      <h2 className="text-3xl text-center mb-7">{score}</h2>
      {chosenSong && (
        <div>
          <AudioPlayer url={chosenSong.url} timer={timer} duration={duration} />
          <Choices
            songs={songsArr as Song[]}
            correctSong={correct as Song}
            onChoiceSelected={handleChoice}
            showHints={showHints}
            duration={duration}
            timer={timer}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
