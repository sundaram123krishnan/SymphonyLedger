"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Plus, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/utils/uploadthing";
import { useSession } from "@/lib/auth-client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { addAlbum } from "@/actions/albums";
import { circIn } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import fetch_artist from "@/actions/artist";

interface Album {
    name: string
    artist: string
    imageUrl: string
    metaIpfs: string
}

interface AlbumListProps {
    albums: Album[]
}

const fetch_metadata = async (metaIpfs) => {
    const response = await fetch(`https://ipfs.io/ipfs/${metaIpfs}`)
    return await response.json()
}

export default function AlbumList({ albums, setAlbums }: { albums: Album[]; setAlbums: Dispatch<SetStateAction<never[]>> }) {
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [active_album, set_active_album] = useState<Album>({
        name: "",
        artist: "",
        imageUrl: "",
        songs: [
            { metaIpfs: "" }
        ]
    })

    const [meta, set_meta] = useState({})
    const { data: session } = useSession();

    const handleSubmit = async () => {
        const added_album = await addAlbum(session, name, image)
        console.log(added_album)

        // Add the new album to the state
        setAlbums((prevAlbums) => [...prevAlbums, added_album]);

        // Clear the form fields after submitting
        setName("");
        setImage("");
    };

    function convertToMinSec(seconds) {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${remainingSeconds}`;
    }

    useEffect(() => {
        if (active_album.songs.length > 0) {
            const fetchAllMetadata = async () => {
                const metadataArray = await Promise.all(
                    active_album.songs.map(({ metaIpfs }) => fetch_metadata(metaIpfs))
                );
                set_meta(metadataArray);
            };
            fetchAllMetadata();
        }
    }, [active_album.name]);


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
                            width={0}
                            height={0}
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
                    {albums.length > 0 && albums.map((album, index) => (
                        <Dialog key={index}>
                            <DialogTrigger onClick={() => set_active_album(album)}>
                                <div
                                    className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={album.imageUrl || "/placeholder.svg"}
                                            alt={`${album.name} cover`}
                                            layout="fill"
                                            unoptimized
                                            objectFit="cover"
                                            className="transition-opacity duration-300 ease-in-out hover:opacity-75"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                            {album.name}
                                        </h3>
                                    </div>
                                </div>
                            </DialogTrigger>

                            <DialogContent className="w-full">
                                <DialogTitle>
                                    Songs in {active_album.name} album
                                </DialogTitle>

                                {meta.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Genre</TableHead>
                                                <TableHead>Artist</TableHead>
                                                <TableHead>Duration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {meta.map((playlist, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{playlist.title}</TableCell>
                                                    <TableCell>{playlist.genre}</TableCell>
                                                    <TableCell>{playlist.artists}</TableCell>
                                                    <TableCell>{convertToMinSec(playlist.duration)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-gray-500">No songs available</p>
                                )}
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </Dialog>
    )
}
