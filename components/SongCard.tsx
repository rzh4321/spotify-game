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

function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad the seconds with a leading zero if less than 10
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}

function truncateString(str: string) {
  if (str.length > 20) {
    return str.substring(0, 20 - 3) + "...";
  } else {
    return str;
  }
}

function timeAgo(dateIsoString: string) {
  const date = new Date(dateIsoString) as any;
  const now = new Date() as any;
  const secondsAgo = Math.round((now - date) / 1000);

  if (secondsAgo < 60) {
    return "Just now";
  }

  const minutesAgo = Math.round(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  }

  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }

  const daysAgo = Math.round(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  }

  const monthsAgo = Math.round(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
  }

  const yearsAgo = Math.round(monthsAgo / 12);
  return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
}

type SongCardProps = {
  songObj: Song;
  num: number;
};

export default function SongCard({ songObj, num }: SongCardProps) {
  return (
    <Table className="bg-navbar-bg">
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs px-5">#</TableHead>
          <TableHead className="text-xs text-center">Title</TableHead>
          <TableHead className="text-xs text-center">Album</TableHead>
          <TableHead className="text-xs text-center">Date Added</TableHead>
          <TableHead className="text-xs text-center">Duration</TableHead>
          <TableHead className="text-xs text-center">Popularity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={uuidv4()}>
          <TableCell className="text-xs w-[1%] px-5">{num}</TableCell>
          <TableCell className="text-xs w-[16.6%] text-center">
            {truncateString(songObj.name)}
          </TableCell>
          <TableCell className="text-xs w-[16.6%] text-center">
            {truncateString(songObj.album)}
          </TableCell>
          <TableCell className="text-xs w-[16.6%] text-center">
            {timeAgo(songObj.date_added)}
          </TableCell>
          <TableCell className="text-xs w-[16.6%] text-center">
            {formatDuration(songObj.duration)}
          </TableCell>
          <TableCell className="text-xs w-[16.6%] text-center">
            {songObj.popularity}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
