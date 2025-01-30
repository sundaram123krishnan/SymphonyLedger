"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import prisma from "@/lib/prisma";

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

interface Artist {
    name: string;
    image: string | null;
    score: number;
}

interface Album {
    id: number;
    name: string;
    albumImage: string;
    artistName: string;
}

const Home = () => {
    const id = useId();
    const [artist, setArtist] = useState<Artist[]>([]);
    const [album, setAlbum] = useState<Album[]>([]);
    const ref = useRef<HTMLDivElement>(null!);
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );

    useOutsideClick(ref, () => setActive(null));

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/top-artists");
                const rankedArtists = await response.json();
                setArtist(rankedArtists);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        })();

        (async () => {
            try {
                const response = await fetch("/api/top-albums");
                const rankedAlbums = await response.json();
                setAlbum(rankedAlbums);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        })();
    }, []);

    return (
        <>
            <main className="px-10 pt-3">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
                    Popular Artists
                </h3>

                <ul className="mx-auto max-w-full gap-4 flex">
                    {artist.length > 0 && artist.map((card, index) => (
                        <motion.div
                            key={index}
                            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                        >
                            <div className="flex gap-4 flex-col justify-center items-center">
                                <motion.div>
                                    <Image
                                        width={100}
                                        height={100}
                                        unoptimized
                                        src={card.image}
                                        alt={card.name}
                                        className="h-40 w-40 md:h-30 md:w-30 rounded-full object-cover object-top"
                                    />
                                </motion.div>

                                <div className="flex flex-col items-center">
                                    <motion.h3
                                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                    >
                                        {card.name}
                                    </motion.h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ul>
            </main>

            <main className="px-10 pt-3">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
                    Popular Albums
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {album.map((album, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={album.albumImage || "/placeholder.svg"}
                                    alt={`${album.name} cover`}
                                    layout="fill"
                                    unoptimized
                                    objectFit="cover"
                                    className="transition-opacity duration-300 ease-in-out hover:opacity-75"
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Album ID: {album.id}</p>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{album.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}

export default Home