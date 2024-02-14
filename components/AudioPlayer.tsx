// import { useEffect, useRef } from "react";

// type AudioPlayerProps = {
//   url: string;
//   duration: number;
// };

// const AudioPlayer = ({ url, duration } : AudioPlayerProps) => {

//   useEffect(() => {
//     // Create a new audio object with the file URL
//     const audio = new Audio(url);

//     // Randomly choose a start time for the audio segment
//     const maxStart = 29 - duration; // Maximum start time to ensure we have a duration-long clip
//     const randomStart = Math.random() * maxStart;

//     // Play the audio from the random start time
//     const playAudio = async () => {
//       console.log('audio is ', audio, ' playing it now...');
//       try {
//         // Set the audio object to start at the random position
//         audio.currentTime = randomStart;
//         await audio.play();
//         console.log('this is after audio.play(). it should be playing rn.')
//       } catch (error) {
//         console.log("Error playing audio:", error);
//         console.error("Error playing audio:", error);
//       }
//     };

//     // Stop the audio after the specified duration
//     const timerId = setTimeout(() => {
//       audio.pause();
//       audio.currentTime = 0;
//     }, duration * 1000);

//     playAudio();

//     // Cleanup function to stop audio if the component unmounts
//     return () => {
//       clearTimeout(timerId);
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, [url, duration]);

//   return null;
// };

// export default AudioPlayer;






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
      console.log('audio is ', audio, ' playing it now...');
      try {
        // Randomly choose a start time for the audio segment
        const maxStart = Math.max(0, 29 - duration); // Ensure maxStart is not negative
        const randomStart = Math.random() * maxStart;
        audio.currentTime = randomStart; // Set the start time

        await audio.play();
        console.log('this is after audio.play(). it should be playing rn.');
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    // If duration is not 0, play the audio
    if (duration > 0) {
      playAudio();
    }

    // Cleanup function to stop audio if the component unmounts
    return () => {
      audio.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Effect to stop the audio after the specified duration
  useEffect(() => {
    const audio = audioRef.current;
    let timerId: NodeJS.Timeout | null = null;

    if (audio && duration > 0) {
      timerId = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, duration * 1000);
    }

    // Cleanup function to clear the timeout
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [duration]);

  return null;
};

export default AudioPlayer;