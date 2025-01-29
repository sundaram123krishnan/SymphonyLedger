"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Song } from "@prisma/client";
import { PlayCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatSongDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function SongRow({ song }: { song: Song }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metadata, setMetadata] = useState<any | undefined>();

  useEffect(() => {
    async function getMetadata() {
      const response = await fetch(`https://ipfs.io/ipfs/${song.metaIpfs}`);
      setMetadata(await response.json());
    }
    getMetadata();
  }, [song.metaIpfs]);

  function copyLink() {
    navigator.clipboard.writeText(
      `${process.env.BETTER_AUTH_URL}/dashboard/songs/${song.tokenId}`
    );
    toast({ title: "Copied link to clipboard" });
  }

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/dashboard/songs/${song.tokenId}`}>
            <PlayCircle className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
          </Link>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {metadata?.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metadata?.genre} •{" "}
              {formatSongDuration(parseInt(metadata?.duration))}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            {/* {song.plays.toLocaleString()} plays */}
          </span>
          <Button variant="ghost" size="icon" onClick={copyLink}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </li>
  );
}
