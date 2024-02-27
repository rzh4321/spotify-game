import type { Song } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type ChoicesProps = {
  songs: Song[];
  correctSong: Song; // The current song that is the correct answer
  onChoiceSelected: (choice: string) => void;
  showHints: boolean;
  duration: number;
  timer: number;
};

const Choices = ({
  songs,
  correctSong,
  onChoiceSelected,
  showHints,
  duration,
  timer,
}: ChoicesProps) => {
  console.log("showhints is ", showHints, "duration is ", duration);
  const [choices, setChoices] = useState<Song[]>([]);
  // Function to get 3 random songs that are not the correct song
  const getRandomSongs = (songs: Song[], correctSong: Song) => {
    // Filter out the correct song
    const incorrectSongs = songs.filter(
      (song) => song.id !== correctSong.id && song.url,
    );
    // Shuffle the incorrect songs
    const shuffled = incorrectSongs.sort(() => 0.5 - Math.random());
    // Get 3 incorrect songs
    const threeIncorrects = shuffled.slice(0, 3);
    // if show hints is enabled, two of three incorrects will disappear
    threeIncorrects[0].hide = true;
    threeIncorrects[1].hide = true;
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
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:p-4">
      {choices.map((song) => (
        <Button
          key={song.id}
          className={`${shouldDisappear(song) ? "hidden" : null} md:text-md bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out`}
          onClick={() => onChoiceSelected(song.name)}
        >
          {song.name}
        </Button>
      ))}
    </div>
  );
};

export default Choices;
