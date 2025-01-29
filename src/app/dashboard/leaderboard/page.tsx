"use client"

import { useState } from "react"
import { Music, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TypographyH2 } from "@/components/typography/H2"

interface Song {
  id: number
  name: string
  artist: string
  plays: number
}

export default function Leaderboard() {
  const [songs, setSongs] = useState<Song[]>([
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", plays: 3200000 },
    { id: 2, name: "Shape of You", artist: "Ed Sheeran", plays: 3100000 },
    { id: 3, name: "Dance Monkey", artist: "Tones and I", plays: 2900000 },
    { id: 4, name: "Someone You Loved", artist: "Lewis Capaldi", plays: 2700000 },
    { id: 5, name: "Rockstar", artist: "Post Malone", plays: 2500000 },
  ])

  return (
    <div className="p-6 rounded-lg shadow-md transition-colors duration-200 bg-white dark:bg-background">
      <TypographyH2>
        Top Played Music
      </TypographyH2>

      <ul className="space-y-4 w-1/2 mt-4">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className="flex items-center space-x-4 p-4 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-background dark:hover:bg-background transition-colors duration-200"
          >
            <span className="text-2xl font-bold text-gray-500 dark:text-gray-300 w-8">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white">{song.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {song.plays.toLocaleString()}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-background"
            >
              <Play className="w-5 h-5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>

  )
}

