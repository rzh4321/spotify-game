import type { Song } from "@/types";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import useStore from "@/gameStore";

type ChoicesProps = {
  songs: Song[];
  correctSong: Song; // The current song that is the correct answer
  onChoiceSelected: (choice: string) => void;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const Choices = ({
  songs,
  correctSong,
  onChoiceSelected,
  buttonRef,
}: ChoicesProps) => {
  const showHints = useStore((state) => state.showHints);
  const duration = useStore((state) => state.duration);
  const timer = useStore((state) => state.timer);

  const [choices, setChoices] = useState<Song[]>([]);
  // Function to get 3 random songs that are not the correct song
  const getRandomSongs = (songs: Song[], correctSong: Song) => {
    // Filter out the correct song
    const incorrectSongs = songs.filter(
      (song) => song.id !== correctSong.id && song.url,
    );
    // Shuffle the incorrect songs
    const shuffled = incorrectSongs.sort(() => 0.5 - Math.random());
    // Get 3 incorrect songs and create new objects
    const threeIncorrects = shuffled.slice(0, 3).map((song) => ({ ...song }));
    // if show hints is enabled, two of three incorrects will disappear
    if (showHints) {
      threeIncorrects[0].hide = true;
      threeIncorrects[1].hide = true;
    }
    return threeIncorrects;
  };

  function shouldDisappear(song: Song) {
    if (
      showHints &&
      song.hide &&
      ((timer === 15 && duration <= 5) ||
        (timer === 10 && duration <= 3) ||
        (timer === 5 && duration <= 2))
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    // Get 3 random incorrect songs
    const incorrectChoices = getRandomSongs(songs, correctSong);

    // Combine the correct song with the incorrect choices and shuffle
    const choices = [correctSong, ...incorrectChoices].sort(
      () => 0.5 - Math.random(),
    );
    setChoices(choices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctSong]); // if correctSong (a memoized object) changes, get incorrect choices and shuffle

  return (
    <>
      <div className="flex flex-col space-y-14 md:space-y-8">
        {choices.map((song) => (
          <Button
            ref={song.name === correctSong.name ? buttonRef : undefined}
            variant={"blue"}
            key={song.id}
            className={`${shouldDisappear(song) ? "invisible" : null} hover:bg-green-700 text-wrap text-2xl h-[80px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-100 ease-in-out`}
            onClick={() => onChoiceSelected(song.name)}
          >
            {song.name}
          </Button>
        ))}
      </div>
    </>
  );
};

export default Choices;
