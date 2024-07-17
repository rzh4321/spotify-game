import { create } from "zustand";

type gameState = {
  score: number | null;
  setScore: (
    score: number | null | ((prevScore: number | null) => number | null),
  ) => void;
  duration: number;
  setDuration: (duration: number | ((prevDuration: number) => number)) => void;
  timer: number;
  setTimer: (timer: number) => void;
  showHints: boolean;
  setShowHints: (showHints: boolean) => void;
};

const useStore = create<gameState>((set) => ({
  score: null,
  setScore: (score) =>
    set((state) => ({
      score:
        typeof score === "function"
          ? (score as (prevScore: number | null) => number | null)(state.score)
          : score,
    })),
  duration: 0,
  setDuration: (duration) =>
    set((state) => ({
      duration:
        typeof duration === "function"
          ? (duration as (prevDuration: number) => number)(state.duration)
          : duration,
    })),
  timer: 10,
  setTimer: (timer: number) => set({ timer }),
  showHints: false,
  setShowHints: (showHints: boolean) => set({ showHints }),
}));

export default useStore;
