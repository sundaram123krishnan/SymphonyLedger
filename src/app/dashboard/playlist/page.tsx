"use client";

import { useState } from "react";
import { TypographyH2 } from "@/components/typography/H2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const playlists = [
  {
    playlistId: 1,
    name: "Chill Vibes",
    description: "Relax and unwind with these mellow tunes.",
    userId: "user_001",
    creator: {
      id: "user_001",
      name: "Alice",
    },
    songs: [
      {
        id: 101,
        title: "Lo-Fi Dreams",
        artist: "DJ Sleepy",
        duration: "3:45",
      },
      {
        id: 102,
        title: "Ocean Waves",
        artist: "Calm Sound",
        duration: "4:12",
      },
    ],
  },
  {
    playlistId: 2,
    name: "Workout Pump",
    description: "High-energy tracks to keep you motivated.",
    userId: "user_002",
    creator: {
      id: "user_002",
      name: "Bob",
    },
    songs: [
      {
        id: 201,
        title: "Beast Mode",
        artist: "Fit Beats",
        duration: "3:30",
      },
      {
        id: 202,
        title: "Power Surge",
        artist: "Electro Blaze",
        duration: "4:05",
      },
    ],
  },
  {
    playlistId: 3,
    name: "Throwback Jams",
    description: "Classic hits from the 80s and 90s.",
    userId: "user_003",
    creator: {
      id: "user_003",
      name: "Charlie",
    },
    songs: [
      {
        id: 301,
        title: "Retro Groove",
        artist: "The Classics",
        duration: "4:15",
      },
      {
        id: 302,
        title: "Old School Vibes",
        artist: "Vinyl Kings",
        duration: "3:50",
      },
    ],
  },
  {
    playlistId: 4,
    name: "Jazz Essentials",
    description: "Smooth jazz to relax and focus.",
    userId: "user_004",
    creator: {
      id: "user_004",
      name: "Diana",
    },
    songs: [
      {
        id: 401,
        title: "Sax Serenity",
        artist: "Miles Groove",
        duration: "5:12",
      },
      {
        id: 402,
        title: "Evening Blues",
        artist: "Jazz Masters",
        duration: "4:55",
      },
    ],
  },
  {
    playlistId: 5,
    name: "Party Anthems",
    description: "Upbeat tracks to keep the party going!",
    userId: "user_005",
    creator: {
      id: "user_005",
      name: "Emma",
    },
    songs: [
      {
        id: 501,
        title: "Turn Up!",
        artist: "DJ Max",
        duration: "3:25",
      },
      {
        id: 502,
        title: "Night Lights",
        artist: "Club Fever",
        duration: "4:20",
      },
    ],
  },
];

export default function PlaylistTable() {
  const [expandedPlaylists, setExpandedPlaylists] = useState<number[]>([]);

  const togglePlaylist = (playlistId: number) => {
    setExpandedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  return (
    <div className="container mx-auto py-10 px-10 pt-3">
      <TypographyH2>Playlists</TypographyH2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Songs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playlists.map((playlist) => (
            <>
              <TableRow key={playlist.playlistId}>
                <TableCell className="font-medium">{playlist.name}</TableCell>
                <TableCell>{playlist.description}</TableCell>
                <TableCell>{playlist.creator.name}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePlaylist(playlist.playlistId)}
                  >
                    {expandedPlaylists.includes(playlist.playlistId) ? (
                      <>
                        Hide Songs <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Songs <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedPlaylists.includes(playlist.playlistId) && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {playlist.songs.map((song) => (
                          <TableRow key={song.id}>
                            <TableCell>{song.title}</TableCell>
                            <TableCell>{song.artist}</TableCell>
                            <TableCell>{song.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
