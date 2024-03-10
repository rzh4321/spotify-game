import type { Song } from "@/types";
import { v4 as uuidv4 } from "uuid";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDuration(ms : number) {  
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    // Pad the seconds with a leading zero if less than 10
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${minutes}:${paddedSeconds}`;
  }
  

function timeAgo(dateIsoString: string) {
    const date = new Date(dateIsoString) as any;
    const now = new Date() as any;
    const secondsAgo = Math.round((now - date) / 1000);
  
    if (secondsAgo < 60) {
      return 'Just now';
    }
  
    const minutesAgo = Math.round(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  
    const hoursAgo = Math.round(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }
  
    const daysAgo = Math.round(hoursAgo / 24);
    if (daysAgo < 30) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
  
    const monthsAgo = Math.round(daysAgo / 30);
    if (monthsAgo < 12) {
      return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    }
  
    const yearsAgo = Math.round(monthsAgo / 12);
    return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
  }

type SongCardProps = {
  songObj: Song;
  num: number;
};

export default function SongCard({
  songObj,
  num,
}: SongCardProps) {
  
  return (
      <Table className="bg-navbar-bg">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs p-0">#</TableHead>
            <TableHead className="text-xs text-center">Title</TableHead>
            <TableHead className="text-xs">Album</TableHead>
            <TableHead className="text-xs">Date Added</TableHead>
            <TableHead className="text-xs">Duration</TableHead>
            <TableHead className="text-xs">Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
                <TableRow
                  key={uuidv4()}
                >
                  <TableCell className="text-xs p-0">{num}</TableCell>
                  <TableCell className="text-xs text-center">{songObj.name}</TableCell>
                  <TableCell className="text-xs">{songObj.album}</TableCell>
                  <TableCell className="text-xs">{timeAgo(songObj.date_added)}</TableCell>
                  <TableCell className="text-xs">{formatDuration(songObj.duration)}</TableCell>
                  <TableCell className="text-xs">{songObj.popularity}</TableCell>
                </TableRow>
        </TableBody>
      </Table>
  );
}
