import React, { useEffect, useRef } from "react";

type AudioPlayerProps = {
  url: string;
  duration: number;
};

const AudioPlayer = ({ url, duration }: AudioPlayerProps) => {
  // Create a ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // On mount and url change, update the audio source
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.src = url;

    const playAudio = async () => {
      console.log("audio is ", audio, " playing it now...");
      try {
        // Randomly choose a start time for the audio segment
        const maxStart = Math.max(0, 29 - duration); // Ensure maxStart is not negative
        const randomStart = Math.random() * maxStart;
        audio.currentTime = randomStart; // Set the start time

        await audio.play();
        console.log("this is after audio.play(). it should be playing rn.");
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    // If duration is not 0, play the audio
    if (duration > 0) {
      playAudio();
    }

    // Cleanup function to stop audio if the component unmounts or rerenders after every round
    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Effect to stop the audio after timer runs out
  useEffect(() => {
    console.log(
      "useEffect running in AudioPlayer since initial mount or duration has changed to ",
      duration,
    );
    const audio = audioRef.current;

    if (audio && duration === 0) {
      console.log(
        "theres audio and duration is 0, so we need to stop audio. stopping now...",
      );
      audio.pause();
      audio.currentTime = 0;
      console.log("audio has been stopped.");
    }
  }, [duration]);

  // Effect to remove audio after unmounting. This prevents user from still being able to play audio
  // after leaving the page
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.src = "";
      }
    };
  }, []);

  return null;
};

export default AudioPlayer;
