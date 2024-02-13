import usePlaylist from "@/hooks/usePlaylist";

export default function Test({playlistId} : {playlistId: string}) {
    const { data, loading, error, refetch } = usePlaylist(playlistId);
    if (loading) {
        return <>Spinner placeholder.</>; 
    }
    if (error) {
      return <>error fetching playlist {playlistId}</>
    }
    function playRandomSegment(audioSrc, segmentDuration) {
        if (segmentDuration >= 29) {
          console.error('Segment duration must be less than total duration of the audio clip.');
          return;
        }
      
        // Create an audio element
        const audio = new Audio(audioSrc);
      
        // Calculate a random start time
        const latestStartTime = 29 - segmentDuration;
        const randomStartTime = Math.random() * latestStartTime;
      
        // Set the audio element to start at the random start time
        audio.currentTime = randomStartTime;
      
        // Play the audio
        audio.play();
      
        // Set a timeout to stop the audio after the desired duration
        setTimeout(() => {
          audio.pause();
          // Optional: Reset the audio to the start or another desired time
          audio.currentTime = 0;
        }, segmentDuration * 1000); // Convert segment duration to milliseconds
      }
    const audios = data.map((track) => (
        <div key={track.id}>
            <p>{track.name}</p>  
            <audio controls src={track.url}></audio>
        </div>
    ))
    playRandomSegment(data[0].url, 10);



    // return audios;
    return <>hi</>
}