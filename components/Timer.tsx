import { useEffect, useState } from 'react';

type TimerProps = {
  duration: number; // duration in seconds
  onTimerEnd: () => void;
};

const Timer = ({ duration, onTimerEnd } : TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Exit early when we reach 0
    if (timeLeft === 0) {
      onTimerEnd();
      return;
    }

    // Save intervalId to clear the interval when the component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // Decrement time left every second

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // Add timeLeft as a dependency to reset the interval when timeLeft changes
  }, [timeLeft, onTimerEnd]);

  return (
    <div>
      Time Remaining: {timeLeft}
    </div>
  );
};

export default Timer;