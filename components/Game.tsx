'use client';

import { useState, useEffect, useMemo } from "react";
import AudioPlayer from "./AudioPlayer";
import Timer from "./Timer";
import Choices from "./Choices";
import usePlaylist from "@/hooks/usePlaylist";
import type { Song } from "@/types";

  const Game = ({playlistId} : {playlistId : string}) => {
    const { data : songsArr, loading, error, refetch } = usePlaylist(playlistId);
    // State to hold the current round, score, and whether the game is over
    const [currentRound, setCurrentRound] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [chosenSong, setChosenSong] = useState<Song | null>(null);
    const [duration, setDuration] = useState<number>(10); // Replace with user input for duration

    const correct = useMemo(() => {
        return chosenSong; // Replace with your actual object structure
      }, [chosenSong]);
    
  
    // Function to start a new round
    const startRound = () => {
        // Randomly select a new song that hasn't been played in the last round
        const newSongsArr = songsArr.filter(song => song.id !== chosenSong?.id);
        const newSong = newSongsArr[Math.floor(Math.random() * newSongsArr.length)];
        
      setChosenSong(newSong);
      setCurrentRound(prevRound => prevRound + 1);
      // Reset any other state relevant to the round here
    };
  
    // Function to handle user's choice
    const handleChoice = (selectedName: string) => {
      if (selectedName === chosenSong.name) {
        setScore(prevScore => prevScore + 1);
        setDuration(10);
        startRound(); // Start the next round if the answer is correct
      } else {
        setIsGameOver(true); // End the game if the answer is wrong
      }
    };
  
    useEffect(() => {
      if (!isGameOver && !loading) {
        startRound(); // Start the first round when the component mounts
      }
    }, [isGameOver, loading]);
  
    if (loading || !correct) {
        return <>Spinner placeholder.</>; 
    }
    if (error) {
      return <>error fetching playlist {playlistId}</>
    }
    if (isGameOver) {
      return <div>Game Over! Your score was: {score}</div>;
    }
    // console.log('chosen song is ', chosenSong)

    return (
      <div>
        <h1>Game Round: {currentRound}</h1>
        <h2>Score: {score}</h2>
        {chosenSong && (
          <>
            <AudioPlayer url={chosenSong.url} duration={duration} />
            <Timer key={currentRound} duration={duration} onTimerEnd={() => setIsGameOver(true)} />
            <Choices songs={songsArr} correctSong={correct} onChoiceSelected={handleChoice} />
          </>
        )}
      </div>
    );
  };
  
  export default Game;