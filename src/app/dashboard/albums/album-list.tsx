"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Plus, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/utils/uploadthing";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface Album {
    id: number
    name: string
    artist: string
    imageUrl: string
}

interface AlbumListProps {
    albums: Album[]
}

export default function AlbumList({ albums, setAlbums }: { albums: AlbumListProps; setAlbums: Dispatch<SetStateAction<never[]>> }) {
    const [name, setName] = useState("")
    const [image, setImage] = useState("")

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string)
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // setAlbums((prevAlbums) => [...prevAlbums, alb]);
        console.log(image)
    };

    return (
        <Dialog>
            <DialogContent>
                <DialogTitle>
                    Add album
                </DialogTitle>

                <CardContent className="pt-6">
                    <div className="space-y-4">

                        {image ? <Image
                            src={image}
                            alt="Album cover"
                            width={100}
                            height={100}
                            unoptimized
                            className="w-full"
                        /> : <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                setImage(res[0].appUrl)
                                alert("Upload Completed");
                            }}
                            onUploadError={(error: Error) => {
                                // Do something with the error.
                                alert(`ERROR! ${error.message}`);
                            }}
                        />}

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">
                                Album Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                placeholder="Enter album title"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Album
                    </Button>
                </CardFooter>
            </DialogContent>

            <div className="container mx-auto p-8">
                <div className="flex justify-between w-full">
                    <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">All Albums</h2>
                    <DialogTrigger><Button><Plus /> Add</Button></DialogTrigger>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map((album, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={album.imageUrl || "/placeholder.svg"}
                                    alt={`${album.name} cover`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-opacity duration-300 ease-in-out hover:opacity-75"
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Album ID: {album.id}</p>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{album.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{album.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    )
}
