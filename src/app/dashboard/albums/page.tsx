"use client"
import { useEffect, useState } from "react";
import AlbumList from "./album-list"

const sampleAlbums = [
  { id: 1, name: "Thriller", artist: "Michael Jackson", imageUrl: "/placeholder.svg?height=300&width=300" },
  { id: 2, name: "Back in Black", artist: "AC/DC", imageUrl: "/placeholder.svg?height=300&width=300" },
  { id: 3, name: "The Dark Side of the Moon", artist: "Pink Floyd", imageUrl: "/placeholder.svg?height=300&width=300" },
  { id: 4, name: "21", artist: "Adele", imageUrl: "/placeholder.svg?height=300&width=300" },
  { id: 5, name: "1", artist: "The Beatles", imageUrl: "/placeholder.svg?height=300&width=300" },
  { id: 6, name: "Born in the U.S.A.", artist: "Bruce Springsteen", imageUrl: "/placeholder.svg?height=300&width=300" },
]

export default function Album() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("/api/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    };

    fetchAlbums();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-background">
      <AlbumList albums={albums} setAlbums={setAlbums} />
    </main>
  )
}
