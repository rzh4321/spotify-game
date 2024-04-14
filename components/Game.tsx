"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import Menu from "./Menu";
import GameOver from "./GameOver";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";
import ErrorMessage from "./ErrorMessage";
import getHighScore from "@/actions/getHighScore";
import UpdatePlaylistAndCreatePlay from "@/actions/UpdatePlaylistAndCreatePlay";
import { Check } from "lucide-react";

const Game = ({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: number;
}) => {
  const buttonRef = useRef<null | HTMLButtonElement>(null);
  // will refetch songs every 5 mins
  const { data, isLoading, error } = usePlaylist(playlistId);
  const [score, setScore] = useState<number | null>(null);
  const [chosenSong, setChosenSong] = useState<Song | null>(null);
  const [duration, setDuration] = useState<number>(0);
  // timer doesn't change once it's set, unlike duration. This is for updating db
  const [timer, setTimer] = useState(10);
  const [showMenu, setShowMenu] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [highScore, setHighScore] = useState<null | number>(null);
  const [selectedSong, setSelectedSong] = useState<string>("");
  const [choseSongThisRound, setChoseSongThisRound] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  // memoize correct song to prevent Choices component from re-choosing a new set
  // of incorrect choices on initial mount
  const correct = useMemo(() => {
    return chosenSong;
  }, [chosenSong]);

  const getSong = () => {
    if (!data?.songsArr) {
      return;
    }
    setChoseSongThisRound(false);
    // Randomly select a new song that didn't just play and has a preview url
    const newSongsArr = data?.songsArr.filter(
      (song) => song.id !== chosenSong?.id && song.url,
    );
    const newSong = newSongsArr[Math.floor(Math.random() * newSongsArr.length)];
    setChosenSong(newSong);
  };

  const updateDatabase = async () => {
    await UpdatePlaylistAndCreatePlay(
      userId,
      playlistId,
      showHints,
      timer,
      score as number,
    );
  };

  // Function to handle user's choice
  const handleChoice = (selectedName: string) => {
    if (!chosenSong) return;
    // if timer didnt expire and player made a choice
    if (selectedName !== "expired") {
      setSelectedSong(selectedName);
      setChoseSongThisRound(true);
    }
    if (selectedName === chosenSong.name) {
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 500);
      setScore((prevScore) => (prevScore as number) + 1);
      setDuration(timer);
    } else {
      setDuration(0); // End the game if the answer is wrong
      if (score === 0) {
        setScore(-1); // need this to make the useEffect() that calls getSong() to be
        // called in case player gets a score of 0
      }
    }
  };

  const getHighScoreAtGameStart = async () => {
    const score = await getHighScore(playlistId, timer, userId, showHints);
    console.log("score is ", score);
    setHighScore(score);
  };

  useEffect(() => {
    // condition means game is ongoing, get a new song after score changes after every round
    if (score !== null && score !== -1 && timer && !isLoading) {
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
          gameReady={!(isLoading || !data?.songsArr)}
          showHints={showHints}
          setShowHints={setShowHints}
          userId={userId}
          timer={timer}
          getHighScore={getHighScoreAtGameStart}
          playlistInfo={data?.playlistInfo}
          songs={data?.songsArr}
        />
        {error && (
          <ErrorMessage
            message={`Failed to fetch playlist: ${error.message}`}
            type="regular"
          />
        )}
      </div>
    );
  }
  // score is not null and duration is 0, player just lost
  if (score !== null && !duration) {
    return (
      <GameOver
        score={score === -1 ? 0 : score}
        setShowMenu={setShowMenu}
        updateDatabase={updateDatabase}
        correct={correct?.name as string}
        selected={choseSongThisRound ? (selectedSong as string) : ""}
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
          handleChoice={handleChoice}
        />
      </div>
      <h2 className="text-3xl text-center mb-7">{score}</h2>
      {chosenSong && (
        <div>
          <AudioPlayer url={chosenSong.url} timer={timer} duration={duration} />
          <Choices
            songs={data?.songsArr as Song[]}
            correctSong={correct as Song}
            onChoiceSelected={handleChoice}
            showHints={showHints}
            duration={duration}
            timer={timer}
            buttonRef={buttonRef}
          />
          <Check
            className={`absolute w-24 h-24 stroke-green-700 opacity-0 drop-shadow-xl bg-green-500 rounded-full scale-0
          ${showEffect && "animate-scaleFade"}`}
            style={{
              top: `${buttonRef.current && buttonRef.current?.getBoundingClientRect().top - buttonRef.current?.offsetHeight / 1.5}px`,
              left: `${buttonRef.current && buttonRef.current?.getBoundingClientRect().left + buttonRef.current?.offsetWidth / 2.5}px`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
