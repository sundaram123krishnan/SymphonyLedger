"use client"
import { useEffect, useState } from "react";
import AlbumList from "./album-list"

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
