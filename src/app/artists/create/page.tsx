"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, UploadIcon, X } from "lucide-react";
import { TypographyH2 } from "@/components/typography/H2";

interface Artist {
  name: string;
  genres: string[];
  image: string | null;
}

export default function CreateArtistCard() {
  const [artist, setArtist] = useState<Artist>({
    name: "",
    genres: [],
    image: null,
  });
  const [genreInput, setGenreInput] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtist((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !artist.genres.includes(genreInput.trim())) {
      setArtist((prev) => ({
        ...prev,
        genres: [...prev.genres, genreInput.trim()],
      }));
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setArtist((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleSubmit = () => {
    console.log("Artist to be added:", artist);
    setArtist({ name: "", genres: [], image: null });
  };

  return (
    <div>
      <TypographyH2>Create Artist</TypographyH2>
      <Card className="mt-4 w-[350px] shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative w-full h-[200px] bg-gray-200 rounded-md overflow-hidden group">
              {artist.image ? (
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt="Artist profile"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <UploadIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white font-medium">Upload Image</span>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Artist Name</Label>
              <Input
                id="name"
                name="name"
                value={artist.name}
                onChange={handleInputChange}
                placeholder="Enter artist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genres</Label>
              <div className="flex gap-2">
                <Input
                  id="genre"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  placeholder="Enter a genre"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGenre();
                    }
                  }}
                />
                <button
                  onClick={handleAddGenre}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {artist.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="px-2 py-1">
                    {genre}
                    <button
                      onClick={() => handleRemoveGenre(genre)}
                      className="ml-2 text-xs hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleSubmit}
            className="flex items-center shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Artist
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
