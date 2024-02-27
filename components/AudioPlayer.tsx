import React, { useEffect, useRef } from "react";

type AudioPlayerProps = {
  url: string;
  timer: number;
  duration: number;
};

const AudioPlayer = ({ url, timer, duration }: AudioPlayerProps) => {
  // Create a ref for the audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  // On mount and url change, update the audio source
  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;

      console.log("audio is ", audioRef.current, " playing it now...");
      try {
        // Randomly choose a start time for the audio segment
        const maxStart = Math.max(0, 29 - timer); // Ensure maxStart is not negative
        const randomStart = Math.random() * maxStart;
        audioRef.current.currentTime = randomStart; // Set the start time

        await audioRef.current.play();
        console.log("this is after audio.play(). it should be playing rn.");
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };
    
    let prevAudioRef: React.RefObject<HTMLAudioElement>;
    if (!audioRef.current) {
      console.log(
        "audioRef.current doesnt exist (it MUST be initial mount). if u see this then how ru gonna play it on initial mount?",
      );
    } else {
      audioRef.current.src = url;
      playAudio();
      prevAudioRef = audioRef;
    }

    // Cleanup function to stop audio if the component unmounts or rerenders after every round
    return () => {
      if (prevAudioRef && prevAudioRef.current) {
        prevAudioRef.current.pause();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Effect to stop the audio after timer runs out
  useEffect(() => {
    // console.log(
    //   "useEffect running in AudioPlayer since initial mount or duration has changed to ",
    //   duration,
    // );
    const audio = audioRef.current;

    if (audio && duration === 0) {
      console.log(
        "theres audio and duration is 0, so we need to stop audio. stopping now...",
      );
      audio.pause();
      audio.currentTime = 0;
      // console.log("audio has been stopped.");
    }
  }, [duration]);

  // Effect to remove audio after unmounting. This prevents user from still being able to play audio
  // after leaving the page
  useEffect(() => {
    // Capture the value of audioRef.current at the time the effect runs
    const currentAudio = audioRef.current;

    return () => {
      // Use the captured value in the cleanup function
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio.load(); // This is sometimes necessary to fully reset the audio element
      }
    };
  }, []);

  return <audio ref={audioRef} className="hidden" />;
};

export default AudioPlayer;
