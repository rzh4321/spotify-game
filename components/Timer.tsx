import { useEffect, useState } from "react";

type TimerProps = {
  duration: number; // duration in seconds
  // onTimerEnd: () => void;
  setDuration: React.Dispatch<React.SetStateAction<number>>
};

const Timer = ({ duration, setDuration }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // useEffect(() => {
  //   // Exit early when we reach 0
  //   if (timeLeft === 0) {
  //     console.log("(IN TIMER) 10s have passed. callign setDuration(0)");
  //     onTimerEnd();
  //     return;
  //   }

  //   // Save intervalId to clear the interval when the component re-renders
  //   const intervalId = setInterval(() => {
  //     setTimeLeft(timeLeft - 1);
  //   }, 1000); // Decrement time left every second

  //   // Clear interval on re-render to avoid memory leaks
  //   return () => clearInterval(intervalId);
  //   // Add timeLeft as a dependency to reset the interval when timeLeft changes
  // }, [timeLeft]);

  useEffect(() => {
    // Set up the interval to decrement the duration every second
    const intervalId = setInterval(() => {
      setDuration((prevDuration) => {
        const nextDuration = prevDuration - 1;
        // When the duration reaches 0, clear the interval
        if (nextDuration <= 0) {
          clearInterval(intervalId);
        }
        return Math.max(nextDuration, 0); // Ensure duration doesn't go below 0
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [setDuration]); // Only re-run the effect if setDuration changes

  return <div>Time Remaining: {duration}</div>;
};

export default Timer;
