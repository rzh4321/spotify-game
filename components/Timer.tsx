import { TimerIcon } from "lucide-react";
import { useEffect } from "react";
import useStore from "@/gameStore";

type TimerProps = {
  handleChoice: (selectedName: string) => void;
};

const Timer = ({ handleChoice }: TimerProps) => {
  const duration = useStore((state) => state.duration);
  const setDuration = useStore((state) => state.setDuration);

  useEffect(() => {
    // Set up the interval to decrement the duration every second
    const intervalId = setInterval(() => {
      setDuration((prevDuration) => {
        const nextDuration = prevDuration - 1;
        // When the duration reaches 0, clear the interval
        if (nextDuration <= 0) {
          clearInterval(intervalId);
          handleChoice("expired");
        }
        return Math.max(nextDuration, 0); // Ensure duration doesn't go below 0
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-[70px] items-center gap-1">
      <TimerIcon className={`${duration <= 3 ? "stroke-red-600" : null}`} />
      <span
        className={`text-lg ${duration <= 3 ? "text-2xl text-red-600" : null}`}
      >
        {duration}
      </span>
    </div>
  );
};

export default Timer;
