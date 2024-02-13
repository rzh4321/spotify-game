import type { Song } from "@/types";
import { useEffect, useState } from "react";

type ChoicesProps = {
  songs: Song[];
  correctSong: Song; // The current song that is the correct answer
  onChoiceSelected: (choice: string) => void;
};

const Choices = ({ songs, correctSong, onChoiceSelected } : ChoicesProps) => {
  const [choices, setChoices] = useState<Song[]>([]);
  // Function to get 3 random songs that are not the correct song
  console.log('correct song is ', correctSong);
  const getRandomSongs = (songs: Song[], correctSong: Song) => {
    // Filter out the correct song
    const incorrectSongs = songs.filter(song => song.id !== correctSong.id);
    // Shuffle the incorrect songs
    const shuffled = incorrectSongs.sort(() => 0.5 - Math.random());
    // Get 3 incorrect songs
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    // Get 3 random incorrect songs
    console.log('SHUFFLING')
    const incorrectChoices = getRandomSongs(songs, correctSong);
    // Combine the correct song with the incorrect choices and shuffle
    const choices = [correctSong, ...incorrectChoices].sort(() => 0.5 - Math.random());
    setChoices(choices);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctSong])



  return (
    <div>
      {choices.map((song, index) => (
        <button
          key={song.id}
          onClick={() => onChoiceSelected(song.name)}
        >
          {song.name}
        </button>
      ))}
    </div>
  );
};

export default Choices;