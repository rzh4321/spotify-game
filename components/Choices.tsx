import type { Song } from "@/types";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";

type ChoicesProps = {
  songs: Song[];
  correctSong: Song; // The current song that is the correct answer
  onChoiceSelected: (choice: string) => void;
  showHints: boolean;
  duration: number;
  timer: number;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const Choices = ({
  songs,
  correctSong,
  onChoiceSelected,
  showHints,
  duration,
  timer,
  buttonRef,
}: ChoicesProps) => {
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
      <div className="flex flex-col space-y-8">
        {choices.map((song) => (
          <Button
            ref={song.name === correctSong.name ? buttonRef : undefined}
            variant={"blue"}
            key={song.id}
            className={`${shouldDisappear(song) ? "invisible" : null} md:text-xl md:h-[80px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out`}
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
