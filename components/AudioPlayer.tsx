import React, { useEffect } from "react";

type AudioPlayerProps = {
  url: string;
  duration: number;
};

const AudioPlayer = ({ url, duration } : AudioPlayerProps) => {
  useEffect(() => {
    // Create a new audio object with the file URL
    const audio = new Audio(url);

    // Randomly choose a start time for the audio segment
    const maxStart = 29 - duration; // Maximum start time to ensure we have a duration-long clip
    const randomStart = Math.random() * maxStart;

    // Play the audio from the random start time
    const playAudio = async () => {
      console.log('audio is ', audio, ' playing it now...');
      try {
        // Set the audio object to start at the random position
        audio.currentTime = randomStart;
        await audio.play();
        console.log('this is after audio.play(). it should be playing rn.')
      } catch (error) {
        console.log("Error playing audio:", error);
        console.error("Error playing audio:", error);
      }
    };

    // Stop the audio after the specified duration
    const timerId = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, duration * 1000);

    playAudio();

    // Cleanup function to stop audio if the component unmounts
    return () => {
      clearTimeout(timerId);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url, duration]);

  return null;
};

export default AudioPlayer;
