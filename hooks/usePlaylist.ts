import { useState, useEffect, useCallback } from 'react';
import getAccessToken from '@/actions/getAccessToken';
import refreshAccessToken from '@/actions/refreshAccessToken';
import getPreviewUrl from '@/actions/getPreviewUrl';
import type { Track, Song } from '@/types';

export default function usePlaylist(playlistId: string) {
  const [data, setData] = useState<null | Song[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getData = useCallback(async (accessToken?: string) => {
    setError(null);

    try {
      if (!accessToken) accessToken = await getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?limit=10000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data: ' + (await response.text()));
      }

      const data = await response.json();
      const promises = data.tracks.items.map(async (track: Track) => {
        let previewUrl: string | null = track.track.preview_url;
        if (!previewUrl) {
          previewUrl = await getPreviewUrl(track.track.id);
        }
        return { id: track.track.id, name: track.track.name, url: previewUrl };
      });
    
      // Wait for all promises to resolve
      const tracks = await Promise.all(promises);
      // console.log('TRACKS IS ', tracks)
      setData(tracks);
      
    } catch (error : any) {
      console.error('An error occurred (access token expired?):', error);
      setError(error as Error);

      // If the token is invalid, try to refresh it once
      if (error instanceof Error && error.message.includes('The access token expired')) {
        console.log('refreshing access token')
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          await getData(newAccessToken);
        }
      }

    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    if (!playlistId) {
        setData(null); // Clear any previous data
        return;
    }
    getData();
}, [getData, playlistId]);

  return { data, loading, error, refetch: getData };
}


