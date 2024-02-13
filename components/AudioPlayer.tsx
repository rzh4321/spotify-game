// import { useEffect, useRef } from 'react';

// type AudioPlayerProps = {
//   url: string;
//   duration: number; // duration in seconds
// };

// const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, duration }) => {
//   const audioRef = useRef<HTMLAudioElement>(null);
//     console.log('audioRef is ', audioRef.current)
//   useEffect(() => {
//     console.log('url is ', url);
//     // Play the audio when the component mounts
//     const playAudio = () => {
//       if (audioRef.current) {
//         audioRef.current.play();
//       }
//     };

//     // Stop the audio after the specified duration
//     const timerId = setTimeout(() => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0; // Reset the audio to the start
//       }
//     }, duration * 1000); // Convert duration to milliseconds

//     playAudio();

//     return () => {
//       // Cleanup: stop the audio if the component is unmounted
//       clearTimeout(timerId);
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
//     };
//   }, [url, duration, audioRef]);

//   return (
//     <audio ref={audioRef} src={url} preload="auto" />
//   );
// };

// export default AudioPlayer;


import React, { useEffect } from 'react';

type AudioPlayerProps = {
  url: string;
  duration: number;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, duration }) => {
  useEffect(() => {
    // Create a new audio object with the file URL
    const audio = new Audio(url);

    // Play the audio
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
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

  // No need to render an audio tag since we're not using refs or needing it in the DOM
  return null;
};

export default AudioPlayer;