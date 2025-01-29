"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlayCircle, Plus, Share2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"


const user = {
    name: "Jane Doe",
    username: "janedoe",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    songsCount: 24,
    followersCount: 1234,
}

const songs = [
    { id: 1, title: "Midnight Serenade", genre: "Jazz", plays: 12500, duration: "3:45" },
    { id: 2, title: "Electric Dreams", genre: "Synthwave", plays: 8700, duration: "4:20" },
    { id: 3, title: "Acoustic Sunrise", genre: "Folk", plays: 5600, duration: "3:10" },
    { id: 4, title: "Urban Rhythm", genre: "Hip Hop", plays: 15000, duration: "3:55" },
    { id: 5, title: "Neon Lights", genre: "Pop", plays: 20100, duration: "3:30" },
]

export default function Profile() {
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    return (
        <Dialog>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Song</DialogTitle>
                    <DialogDescription>
                        Upload your new song here. Click save to continue.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Song Name
                        </Label>
                        <Input
                            id="song-name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <FileUpload onChange={handleFileUpload} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>


            <div className="min-h-screen transition-colors duration-200 px-10 pt-3">
                <header className="bg-white dark:bg-background shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar className="h-20 w-20 mr-4">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                                <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="mr-4">{user.songsCount} songs</span>
                                    <span>{user.followersCount.toLocaleString()} followers</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button>Follow</Button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="flex justify-between w-full">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Published Songs</h2>
                            <DialogTrigger asChild>
                                <Button><Plus />
                                    Add</Button>
                            </DialogTrigger>
                        </div>

                        <div className="bg-white dark:bg-background shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {songs.map((song) => (
                                    <li key={song.id}>
                                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <PlayCircle className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{song.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {song.genre} • {song.duration}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                                                    {song.plays.toLocaleString()} plays
                                                </span>
                                                <Button variant="ghost" size="icon">
                                                    <Share2 className="h-5 w-5" />
                                                    <span className="sr-only">Share</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </Dialog>
    )
}
