"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UploadIcon } from "lucide-react";
import { TypographyH2 } from "@/components/typography/H2";

interface Album {
  title: string;
  artist: string;
  image: string | null;
}

export default function AddAlbumCard() {
  const [album, setAlbum] = useState<Album>({
    title: "",
    artist: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbum((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAlbum((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log("Album to be added:", album);
    setAlbum({ title: "", artist: "", image: null });
  };

  return (
    <div>
      <TypographyH2>Create Album</TypographyH2>
      <div className="flex justify-center items-center h-screen">
        <Card className="mt-4 w-[350px] shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative w-full h-[200px] bg-gray-200 rounded-md overflow-hidden group">
                {album.image ? (
                  <Image
                    src={album.image || "/placeholder.svg"}
                    alt="Album cover"
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
                <Label htmlFor="title" className="text-white">
                  Album Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={album.title}
                  onChange={handleInputChange}
                  placeholder="Enter album title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist" className="text-white">
                  Artist
                </Label>
                <Input
                  id="artist"
                  name="artist"
                  value={album.artist}
                  onChange={handleInputChange}
                  placeholder="Enter artist name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <button
              onClick={handleSubmit}
              className="flex items-center shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Album
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
