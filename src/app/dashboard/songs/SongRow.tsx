import { Button } from "@/components/ui/button";
import { PlayCircle, Share2 } from "lucide-react";
import { Song } from "./SongsTable";
import { useEffect, useState } from "react";

export function SongRow({ song }: { song: Song }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metadata, setMetadata] = useState<any | undefined>();

  useEffect(() => {
    async function getMetadata() {
      const response = await fetch(song.metadataUrl);
      setMetadata(await response.json());
    }
    getMetadata();
  }, [song.metadataUrl]);

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <PlayCircle className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {song.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metadata?.genre} • {metadata?.duration.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            {/* {song.plays.toLocaleString()} plays */}
          </span>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </li>
  );
}
